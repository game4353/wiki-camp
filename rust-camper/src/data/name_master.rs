use super::replace_numeric_keys::bin_to_json;
use crate::{
    file::{
        dir::{dir_master_json, path_raw_master},
        rw::{read_bytes, write_json},
    },
    game::cnst::Lan,
};
use csv::WriterBuilder;
use serde_json::Value;
use std::{convert::identity, error::Error, path::PathBuf};

/// this read master bin and write master json
fn name_master() -> Result<(), Box<dyn Error>> {
    for lan in Lan::all() {
        let bin_path = path_raw_master(&lan);
        let bytes = read_bytes(bin_path)?;
        let json = bin_to_json(bytes, "Pmaster::All");
        let folder = dir_master_json(&lan);
        json.as_object().unwrap().iter().try_for_each(|(k, v)| {
            let path = folder.join(k).with_extension("json");
            write_json(v, path, 0)?;
            Ok::<(), Box<dyn Error>>(())
        })?;
    }
    Ok(())
}

pub fn json_equal(val1: &Value, val2: &Value) -> bool {
    match (val1, val2) {
        (Value::Object(obj1), Value::Object(obj2)) => {
            if obj1.len() != obj2.len() {
                return false;
            }
            for (key, value1) in obj1 {
                if let Some(value2) = obj2.get(key) {
                    if !json_equal(value1, value2) {
                        return false;
                    }
                } else {
                    return false;
                }
            }
            true
        }
        (Value::Array(arr1), Value::Array(arr2)) => {
            if arr1.len() != arr2.len() {
                return false;
            }
            arr1.iter()
                .zip(arr2.iter())
                .all(|(item1, item2)| json_equal(item1, item2))
        }
        _ => val1 == val2,
    }
}

pub fn json_to_tsv(val: &Value, fields: Vec<&str>, path: PathBuf) -> Result<(), Box<dyn Error>> {
    let mut tsv_writer = WriterBuilder::new().delimiter(b'\t').from_path(path)?;

    // Write TSV header
    tsv_writer.write_record(&fields)?;

    // Write TSV rows
    let arr = match val {
        Value::Array(a) => a.iter().map(identity).collect(),
        _ => vec![val],
    };
    for obj in arr {
        let row: Vec<String> = fields
            .iter()
            .map(|field| match obj.get(field) {
                Some(Value::Null) => "".to_string(),
                Some(Value::String(s)) => s.to_owned(),
                Some(other) => other.to_string(),
                None => "".to_string(),
            })
            .collect();
        tsv_writer.write_record(&row)?;
    }

    Ok(())
}

// fn write_master_tsv() {
//     let folder = get_master_json_dir(Lan::JA);

// }
