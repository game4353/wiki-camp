mod authorize;
mod certificate;
// mod generate;
mod master;
mod ranking;
mod resource;
mod user;

use super::{
    cnst::{Lan, Vers},
    version::app_version,
};
use crate::file::try_unzip_bytes;
use chrono::Utc;
use chrono_tz::Asia::Tokyo;
use md5;
use reqwest::header::{HeaderMap, HeaderValue};
use std::error::Error;
use url::Url;

/// list of key-value string pairs
pub type Kvs<'a> = Vec<(&'static str, &'a str)>;

/// [(1, 2), (3, 4)] => 1=2&3=4
fn to_body(data: Kvs) -> String {
    data.iter()
        .map(|(key, value)| format!("{}={}", key, value))
        .collect::<Vec<String>>()
        .join("&")
}

/// return timestamp in Japan timezone. e.g. 2023-02-02140730
pub fn jp_timestamp() -> String {
    let dt = Utc::now();
    let jp_time = dt.with_timezone(&Tokyo);
    format!("{}", jp_time.format("%Y-%m-%d%H%M%S"))
}

#[derive(Debug, Default)]
pub struct Client {
    /// the one shows left bottom of the game
    pub uid: String,
    uuid: String,
    /// e.g. 1.2.345
    ver: String,
    headers: HeaderMap,
}

impl Client {
    pub fn new(uid: String, uuid: String) -> Client {
        let mut c = Client::default();
        c.add_basic_headers();
        c.set_uuid(uuid);
        c.uid = uid;
        c
    }

    pub fn add_headers(&mut self, headers: Kvs) -> &mut Self {
        headers.iter().for_each(|(key, val)| {
            self.headers
                .insert(*key, HeaderValue::from_str(val).unwrap());
        });
        self
    }

    /// input important folders and queries of GET, output the url to send request
    pub fn get_url(&self, path: &str, queries: Option<Kvs>) -> String {
        const HOST: &str = "https://www-owl-jp.enish-games.com/";
        let mut url = Url::parse(HOST).unwrap();
        let ver = format!("v{}/", self.ver.replace(".", "_"));
        url = url.join(&ver).unwrap();
        url = url.join(path).unwrap();
        let qs = queries.map(to_body);
        url.set_query(qs.as_deref());
        url.to_string()
    }

    fn set_uuid(&mut self, uuid: String) {
        self.add_headers(vec![
            ("X-Enish-Idfv", &uuid),
            ("X-Enish-Adid", &format!("{:x}", md5::compute(&uuid))),
        ]);
        self.uuid = uuid;
    }

    fn add_basic_headers(&mut self) {
        self.add_headers(vec![
            ("Accept", "*/*"),
            ("Content-Type", "application/x-www-form-urlencoded"),
            ("X-Unity-Version", "2021.3.21f1"),
            ("X-Enish-App-Store", "iTunes"),
            ("X-Enish-App-User-Agent", "ios"),
            ("Accept-Encoding", "gzip, deflate, br"),
            ("X-Enish-App-Platform", "ios"),
            ("Accept-Language", "ja"),
        ]);
    }

    /// input example: 1.2.345
    pub fn set_ver(&mut self, ver_str: &str) -> &mut Self {
        self.ver = ver_str.to_owned();
        let user_agent = format!(
            "ProductName/{} CFNetwork/1404.0.5 Darwin/22.3.0",
            2974 // TODO this changes but not very important
        );
        self.add_headers(vec![
            ("X-Enish-App-Version", &ver_str),
            ("User-Agent", &user_agent),
        ]);
        self
    }

    pub async fn send_get(
        &mut self,
        path: &str,
        queries: Option<Kvs<'_>>,
    ) -> Result<Vec<u8>, reqwest::Error> {
        let client = reqwest::Client::new();
        let url = self.get_url(path, queries);
        let response = client.get(url).headers(self.headers.clone()).send().await?;
        let response_body = response.bytes().await?;
        let bytes = try_unzip_bytes(response_body.into());
        Ok(bytes)
    }

    pub async fn send_post(
        &mut self,
        path: &str,
        body: Kvs<'_>,
    ) -> Result<Vec<u8>, reqwest::Error> {
        let client = reqwest::Client::new();
        let url = self.get_url(path, None);
        let body = to_body(body);
        let response = client
            .post(url)
            .body(body)
            .headers(self.headers.clone())
            .send()
            .await?;
        let response_body = response.bytes().await?;
        let bytes = try_unzip_bytes(response_body.into());
        Ok(bytes)
    }
    pub async fn send_put(
        &mut self,
        path: &str,
        body: Vec<u8>,
    ) -> Result<Vec<u8>, reqwest::Error> {
        let client = reqwest::Client::new();
        let url = self.get_url(path, None);
        let response = client
            .put(url)
            .body(body)
            .headers(self.headers.clone())
            .send()
            .await?;
        let response_body = response.bytes().await?;
        let bytes = try_unzip_bytes(response_body.into());
        Ok(bytes)
    }

    /// leave {ver} empty to use latest version
    /// 
    /// return (vers, master_bytes, resource_bytes)
    pub async fn login(
        &mut self,
        ver: &str,
        lan: Lan,
    ) -> Result<(Vers, Vec<u8>, Vec<u8>), Box<dyn Error>> {
        if ver.is_empty() {
            let ver = app_version().await?;
            self.set_ver(&ver);
        } else {
            self.set_ver(ver);
        }
        let auth = self.req_authorize(&lan).await?;
        let session = auth["session"].as_str().unwrap();

        let cert = self.req_certificate(session).await?;
        println!("{:?}", cert);

        let version = &cert["version"];
        let vers = Vers {
            application: version["application"].as_str().unwrap().to_owned(),
            resource: version["resource"].as_i64().unwrap() as i32,
            master: version["master"].as_i64().unwrap() as i32,
        };
        let master_bytes = self.req_master(&vers).await?;
        let resource_bytes = self.req_resource().await?;
        Ok((vers, master_bytes, resource_bytes))
    }
}

#[cfg(test)]
mod test {
    use super::*;

    #[tokio::test]
    async fn t() {
        let mut acc = Client::account(1);
        let res = acc.login("", Lan::JA).await.unwrap();
        println!("{:?}", res.0);
    }
}