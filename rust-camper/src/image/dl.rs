use crate::{
    file::{
        dir::{dir_asset, dir_resource_raw, dir_rust, path_json_asset},
        rw::{read_json, write_file},
    },
    game::cnst::Lan,
};
use rand::Rng;
use futures::future::join_all;
use reqwest::Client;
use serde_json::Value;
use std::{
    collections::HashMap, error::Error, ffi::OsStr, path::PathBuf, process::Command, thread,
    time::Duration,
};

fn sleep_random(min: usize, max: usize) {
    let mut rng = rand::thread_rng();
    let millis = rng.gen_range(min..=max);    
    let duration = Duration::from_millis(millis as u64);
    thread::sleep(duration);
}

#[derive(Debug)]
struct Asset {
    id: u32,
    hash: String,
    _size: u32,
    lan: Lan,
}

impl Asset {
    fn url(&self) -> String {
        String::from("https://assets-production.enish-games.com/owl/Resources/ios/") + &self.hash
    }
    fn download_path(&self) -> PathBuf {
        dir_resource_raw(&self.lan)
            .join(self.id.to_string())
            .join(&self.hash)
    }
    /// Return: true if download, false if cached.
    async fn download(&self, verbose: bool) -> Result<bool, Box<dyn Error>> {
        let path = self.download_path();
        if path.exists() {
            Ok(false)
        } else {
            let client = Client::new();
            let url = self.url();
            // TODO: this sometimes fails
            let mut retry = 0;
            let response = loop {
                let res = client.get(&url).send().await;
                if retry >= 5 || res.is_ok() {
                    break res;
                }
                sleep_random(500, 1800);
                retry += 1;
            };
            let bytes = response?.bytes().await?;
            write_file(&bytes, &path, 4)?;
            if verbose {
                println!("Downloaded: {}", path.canonicalize()?.to_str().unwrap());
            }
            parse_asset(&path);
            Ok(true)
        }
    }
}

/// read <data>/{lan}/iOS and create HashMap<u32, Asset>
fn get_assets(lan: Lan) -> HashMap<u32, Asset> {
    let path = path_json_asset(&lan);
    let json: Value = read_json(path).unwrap();
    json["resource"]
        .as_object()
        .unwrap()
        .iter()
        .map(|(i, o)| {
            let id: u32 = i.parse().unwrap();
            let obj = o.as_object().unwrap();
            (
                id,
                Asset {
                    id,
                    hash: obj["hash"].as_str().unwrap().to_owned(),
                    _size: obj["size"].as_u64().unwrap() as u32,
                    lan,
                },
            )
        })
        .collect()
}

/// for ids that pass {id_filter}, download to <assets>/raw/{lan}/{id}_{hash}
pub async fn download_assets<T>(lan: Lan, id_filter: T, verbose: bool)
where
    T: Fn(u32) -> bool,
{
    join_all(
        get_assets(lan)
            .iter()
            .filter(|(i, _v)| id_filter(**i))
            .map(|(_i, v)| v.download(verbose)),
    )
    .await
    .into_iter()
    .collect::<Result<Vec<_>, _>>()
    .unwrap();
}

fn parse_asset<P>(file_path: P)
where
    P: AsRef<OsStr>,
{
    let py_path = dir_rust().join(r"src\image\parse_asset.py");
    let folder = dir_asset("..");
    let output = Command::new("python")
        .arg(py_path)
        .arg("-i")
        .arg(file_path)
        .arg("-o")
        .arg(folder)
        .output()
        .expect("failed to execute process");
    if !output.stdout.is_empty() {
        let stdout = String::from_utf8_lossy(&output.stdout);
        print!("STDOUT: {}", stdout);
    }
    if !output.stderr.is_empty() {
        let stderr = String::from_utf8_lossy(&output.stderr);
        println!("STDERR: {}", stderr);
    }
}
