use std::io::Read;
use self::{dir::dir_master_json, rw::read_json};
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
