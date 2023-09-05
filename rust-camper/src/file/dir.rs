/*

$ROOT_DIR/
    └ app/
        └ (nextjs things)
    └ data/
        └ master/
            └ [lan]
                └ xxx.json
    └ public/
        └ images/
            └ assets/
                └ (unity assets)
            └ atlas
    └ rust-camper/
        └ cs/
            └ (in-game classes)
        └ data/
            └ master/
            └ resource/
                └ [lang]
                    └ [id]
                        └ [hash] (unity assets binary files)
        └ src/
        └ target/
        └ .env
        └ Cargo.toml
        └ ...

*/

use super::env::env_var;
use crate::game::cnst::Lan;
use std::path::{Path, PathBuf};

/// get the root folder of the nextJS project
pub fn dir_root() -> PathBuf {
    Path::new(&env_var("ROOT_DIR")).to_path_buf()
}

/// get the root folder of the rust project
pub fn dir_rust() -> PathBuf {
    dir_root().join("rust-camper")
}

pub fn dir_cs() -> PathBuf {
    dir_rust().join("cs")
}

/// get the image folder and go to the relative path
pub fn dir_image(rel_path: impl AsRef<Path>) -> PathBuf {
    dir_root().join("public/images").join(rel_path)
}

/// get the merged image folder and go to the relative path
pub fn dir_merged(rel_path: impl AsRef<Path>) -> PathBuf {
    dir_image("merged").join(rel_path)
}

/// get the parsed asset folder and go to the relative path
pub fn dir_asset(rel_path: impl AsRef<Path>) -> PathBuf {
    dir_image("assets").join(rel_path)
}

/// get the data folder that stores master json in language {lan}
pub fn dir_master_json(lan: &Lan) -> PathBuf {
    dir_root().join("data/master").join(lan)
}

/// TODO: make it tsv
pub fn dir_resource_json(lan: &Lan) -> PathBuf {
    dir_root().join("data/resource").join(lan)
}

/// this stores raw asset binary files as caches
pub fn dir_resource_raw(lan: &Lan) -> PathBuf {
    dir_rust().join("data/resource").join(lan)
}

/// get the raw asset file path
pub fn path_json_asset(lan: &Lan) -> PathBuf {
    dir_resource_json(lan).join("iOS.json")
}

pub fn path_spy() -> PathBuf {
    let path = env_var("MY_SPY_PATH");
    Path::new(&path).to_path_buf()
}

pub fn path_dll() -> PathBuf {
    let path = env_var("MY_DLL_PATH");
    Path::new(&path).to_path_buf()
}
