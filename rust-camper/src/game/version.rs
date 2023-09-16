use super::cnst::{Lan, Vers};
use crate::file::master_json;
use regex::Regex;
use reqwest::Client;
use serde_json::Value;
use std::error::Error;

/// this returns the version of つなキャン△. e.g., "1.2.345"
pub async fn app_version() -> Result<String, Box<dyn Error>> {
    let response = Client::new()
        .get("https://itunes.apple.com/lookup?id=1661047955&entity=software")
        .send()
        .await?
        .text()
        .await?;

    let obj: Value = serde_json::from_str(&response)?;
    let obj = obj.get("results").ok_or("err")?.get(0).ok_or("err")?;

    let _ts = obj
        .get("currentVersionReleaseDate")
        .ok_or("err")?
        .as_str()
        .ok_or("err")?
        .to_string();
    let version = obj
        .get("version")
        .ok_or("err")?
        .as_str()
        .ok_or("err")?
        .to_string();
    let track_name = obj.get("trackName").ok_or("err")?.as_str().ok_or("err")?;
    if track_name != "Laid-Back Camp All -in -one!!" {
        return Err(format!("\"{}\" is not the game you are looking for.", track_name).into());
    }

    Ok(version)
}

/// this returns the version downloaded
pub fn get_cached_ver(lan: Lan) -> Vers {
    match master_json(lan, "version") {
        Some(json) => {
            let item = json.get(0).unwrap();
            let master = item["master"].as_i64().unwrap() as i32;
            let resource = item["resource"].as_i64().unwrap() as i32;
            let application = item["application"].as_str().unwrap().to_owned();
            Vers {
                application,
                resource,
                master,
            }
        }
        None => Vers::default(),
    }
}

/// this returns the version of つなキャン△. e.g., "1.2.345"
pub async fn web_version() -> Result<String, Box<dyn Error>> {
    let response = Client::new()
        .get("https://apps.apple.com/app/id1661047955")
        .send()
        .await?
        .text()
        .await?;

    Ok(Regex::new(r">Version (\d+\.\d+.\d+)<")
        .unwrap()
        .captures(&response)
        .unwrap()
        .get(1)
        .unwrap()
        .as_str()
        .to_string())
}
