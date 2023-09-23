use std::io::Read;
use self::{dir::{dir_master_json, dir_ranking_json}, rw::read_json};
use crate::game::cnst::Lan;
use flate2::read::GzDecoder;
use serde_json::Value;

pub mod dir;
pub mod env;
pub mod rw;

/// filename without ".json"
pub fn master_json(lan: Lan, filename: &str) -> Option<Value> {
    let path = dir_master_json(&lan).join(filename).with_extension("json");
    if path.exists() {
        Some(read_json(path).unwrap())
    } else {
        None
    }
}

/// return unzipped input, or input itself
pub fn try_unzip_bytes(bytes: Vec<u8>) -> Vec<u8> {
    let mut decoder = GzDecoder::new(&bytes[..]);
    let mut buffer = Vec::new();
    match decoder.read_to_end(&mut buffer) {
        Ok(_) => buffer,
        Err(_) => bytes,
    }
}

/// page is 1~50
pub fn read_user_db(page: i32) -> Vec<u64> {
    let file_path = dir_ranking_json(706).join(format!("page{}.json", page));
    let obj: Value = read_json(file_path).unwrap();
    let rank_list_user = obj.get("list").unwrap();
    let uids = rank_list_user
        .as_array()
        .unwrap()
        .iter()
        .map(|v| v
            .get("user")
            .unwrap()
            .get("uid")
            .unwrap()
            .as_u64()
            .unwrap()
            .to_owned()
        )
        .collect();
    uids
}

/// get 5000 users' uids
pub fn read_user_dbs() -> Vec<u64> {
    let mut res = Vec::new();
    for page in 1..=50 {
        let mut other = read_user_db(page);
        res.append(&mut other);
    }
    res
}