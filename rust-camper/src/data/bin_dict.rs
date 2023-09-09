use serde_json::{json, Map, Value};
use std::{collections::VecDeque, mem};

pub fn vari64(id: u8, mut n: i64) -> Vec<u8> {
    if n == 0 {
        vec![]
    } else {
        let mut v = vec![id << 3];
        let mask = 0b0111_1111;
        loop {
            let b7 = (n & mask) as u8;
            n >>= 7;
            if n > 0 {
                v.push((!mask as u8) | b7);
            } else {
                v.push(b7);
                break;
            }
        }
        v
    }
}

pub fn fixed64(id: u8, d: f64) -> Vec<u8> {
    if d == 0.0 {
        vec![]
    } else {
        let bytes: [u8; 8] = unsafe { mem::transmute(d) };
        [vec![(id << 3) | 1], bytes.to_vec()].concat()
    }
}

pub fn decode_bytes(bytes: Vec<u8>) -> Value {
    let mut vd: VecDeque<u8> = bytes.into_iter().collect();
    let map = decode_dq_bytes(&mut vd).unwrap();
    Value::Object(map)
}

fn decode_dq_bytes(bytes: &mut VecDeque<u8>) -> Result<Map<String, Value>, String> {
    let mut m = Map::new();

    let mut insert = |idx: usize, value: Value| {
        let k = idx.to_string();
        if m.contains_key(&k) {
            let v = m.entry(&k).or_insert(json!(0));
            if v.is_array() {
                v.as_array_mut().unwrap().push(value);
            } else {
                let arr = vec![v.take(), value];
                m.insert(k, Value::Array(arr));
            }
        } else {
            m.insert(k, value);
        }
    };

    while !bytes.is_empty() {
        let tag = consume_var_num(bytes, false).0 as u32;
        let field = (tag >> 3) as usize;
        let wire = tag & 7;

        match wire {
            0 => {
                // Number wire
                let val = consume_var_num(bytes, true).0;
                insert(field, json!(val));
            }
            1 => {
                // 64-bit number
                let size: usize = 8;
                if size > bytes.len() {
                    return Err(format!(
                        "[Error] (wire=1) Parse {} bytes from {} bytes.",
                        size,
                        bytes.len()
                    ));
                }
                let arr: Vec<u8> = bytes.drain(..size).collect();
                let val = u64::from_le_bytes(arr.try_into().unwrap());
                insert(field, json!(val));
            }
            2 => {
                // String or object wire
                if bytes.len() == 0 {
                    insert(field, json!(""));
                    break;
                }
                let size = consume_var_num(bytes, false).0 as usize;
                if size > bytes.len() {
                    return Err(format!(
                        "[Error] (wire=2) Parse {} bytes from {} bytes.",
                        size,
                        bytes.len()
                    ));
                }
                let arr: Vec<u8> = bytes.drain(..size).collect();
                let mut deque: VecDeque<u8> = VecDeque::from(arr.clone());

                if size == 0 {
                    insert(field, json!(""));
                } else if deque[0] < 32 {
                    // pretty lame to decide if not string
                    let obj = decode_dq_bytes(&mut deque);
                    let val = match obj {
                        Ok(o) => Value::Object(o),
                        Err(e) => Value::String(e),
                    };
                    insert(field, val);
                } else {
                    match String::from_utf8(arr) {
                        Ok(string) => {
                            insert(field, json!(string));
                        }
                        Err(_error) => {
                            let obj = decode_dq_bytes(&mut deque);
                            let val = match obj {
                                Ok(o) => Value::Object(o),
                                Err(e) => Value::String(e),
                            };
                            insert(field, val);
                        }
                    }
                }
            }
            5 => {
                // 32-bit number
                let size: usize = 4;
                if size > bytes.len() {
                    return Err(format!(
                        "[Error] (wire=5) Parse {} bytes from {} bytes.",
                        size,
                        bytes.len()
                    ));
                }
                let arr: Vec<u8> = bytes.drain(..size).collect();
                let value = u32::from_le_bytes(arr.try_into().unwrap());
                insert(field, json!(value));
            }
            _ => return Err(format!("[Error] (wire={}) Invalid wire.", wire)),
        }
    }

    Ok(m)
}

fn consume_var_num(bytes: &mut VecDeque<u8>, allow_insufficient: bool) -> (i32, Vec<u8>) {
    if allow_insufficient && bytes.len() == 0 {
        return (0, vec![]);
    }

    let mut byte = bytes.pop_front().unwrap();
    let mut _neg = false;
    let mut popped = vec![byte];

    // not sure if i should check len
    while byte & 0b10000000 != 0 && bytes.len() > 0 {
        byte = bytes.pop_front().unwrap();
        popped.push(byte);

        // normally at most use 10 bytes to have negative i64
        // too lazy to check wrong input
    }

    (concat_7bits(&popped) as i32, popped)
}

fn concat_7bits(bytes: &[u8]) -> u64 {
    let mut shift = 0;
    let mut num: u64 = 0;

    for &b in bytes {
        let b = ((b & 0x7f) as u64) << shift;
        num |= b;
        shift += 7;
    }
    num
}

#[cfg(test)]
mod tests {
    use std::{
        fs::File,
        io::{Read, Write},
        path::Path,
    };

    use super::*;

    #[test]
    fn test_any() {
        let file_path = r"E:\katian\_github\game4353\camp-data\data\raw\ja\all";
        let mut file = File::open(file_path).unwrap();
        let mut buffer = Vec::new();
        file.read_to_end(&mut buffer).unwrap();
        let v = decode_bytes(buffer);
        let json_path = Path::new(&file_path).parent().unwrap().join("test.json");
        let json_data = serde_json::to_string(&v).unwrap();
        let mut file = File::create(json_path).unwrap();
        file.write_all(json_data.as_bytes()).unwrap();
    }

    #[test]
    fn test_7bits() {
        let bytes: Vec<u8> = vec![0b1111_1010, 0b1111_0110, 0b111];
        let res = concat_7bits(&bytes) as i32;
        let ans: i32 = 0b111_111_0110_111_1010;
        assert_eq!(res, ans);
        let bytes: Vec<u8> = vec![0xfe, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x1];
        let res = concat_7bits(&bytes) as i32;
        let ans: i32 = -2;
        assert_eq!(res, ans);
    }

    #[test]
    fn test_consume_var_num() {
        let v: Vec<u8> = vec![0b10011111, 0b11000100, 0b00000001, 9];
        let mut bytes = VecDeque::new();
        bytes.extend(v);
        let (res, popped) = consume_var_num(&mut bytes, false);
        let ans = 0b1_1000100_0011111;
        println!("{:?}", popped);
        assert_eq!(res, ans);
        assert_eq!(bytes, [9]);
    }
}
