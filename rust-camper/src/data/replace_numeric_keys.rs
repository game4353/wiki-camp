use std::mem;
use super::{class_struct::ClassStruct, bin_dict::decode_bytes};
use regex::Regex;
use serde_json::{Value, json};

fn to_array(v: Value) -> Vec<Value> {
    if let Value::Array(a) = v {
        a
    } else {
        vec![v]
    }
}

fn to_string(v: Value) -> String {
    match v {
        Value::String(s) => s,
        Value::Number(n) => n.to_string(),
        Value::Bool(b) => b.to_string(),
        Value::Null => "".to_string(),
        _ => panic!("{} is not a string.", v),
    }
}

pub fn replace_numeric_keys(value: Value, type_str: &str) -> Value {
    match type_str {
        "u8" | "i32" | "i64" | "String" => value,
        "bool" => {
            let n = value.as_u64().unwrap();
            match n {
                0 => json!(true),
                1 => json!(false),
                x => panic!("\"{}\" can not be a bool.", x),
            }
        },
        "u32" => {
            let n = value.as_i64().unwrap();
            let u = (n & 0xFFFFFFFF) as u32;
            json!(u)
        }
        "f64" => {
            let n = value.as_u64().unwrap();
            let d: f64 = unsafe {
                mem::transmute(n)
            };
            json!(d)
        },
        s if s.starts_with("Vec<") => {
            let next_type = &s[4..s.len() - 1];
            Value::Array(
                to_array(value)
                    .into_iter()
                    .map(|v| replace_numeric_keys(v, next_type))
                    .collect(),
            )
        }
        s if s.starts_with("HashMap<") => {
            let next_type = Regex::new(", (.+)>")
                .unwrap()
                .captures(s)
                .unwrap()
                .get(1)
                .unwrap()
                .as_str();
            Value::Object(
                to_array(value)
                    .iter_mut()
                    .map(|v| {
                        let key = v["1"].take();
                        let val = v["2"].take();
                        (to_string(key), replace_numeric_keys(val, next_type))
                    })
                    .collect(),
            )
        }
        s if s.contains("::") => match value {
            Value::Object(map) => Value::Object(
                map.into_iter()
                    .map(|(key, value)| {
                        let cs = ClassStruct::fetch(s);
                        let index: usize = key.parse().unwrap();
                        let new_key = cs.prop_names[index].clone();
                        let new_type = cs.get_rs_type(index);
                        (new_key, replace_numeric_keys(value, &new_type))
                    })
                    .collect(),
            ),
            Value::String(s) => {
                if s.starts_with("[Error]") || s.is_empty() {
                    Value::Null
                } else {
                    panic!("'{}' is not a struct.", s)
                }
            },
            Value::Number(n) => {
                let cs = ClassStruct::fetch(s);
                let index = n.as_u64().unwrap() as usize;
                let s = cs.enums[index].clone();
                Value::String(s)
            }
            x => panic!("can not parse '{:?}' as '{}'.", x, s),
        },
        x => panic!("unknown type: {}", x),
    }
}

pub fn bin_to_json(bytes: Vec<u8>, type_str: &str) -> Value {
    let dict = decode_bytes(bytes);
    replace_numeric_keys(dict, type_str)
}
