use super::{jp_timestamp, Client};

impl Client {
    pub async fn req_resource(&mut self) -> reqwest::Result<Vec<u8>> {
        let ts = jp_timestamp();
        let uid = self.uid.clone();
        self.send_get(
            "resource/list/iOS",
            Some(vec![("__uid", &uid), ("__ts", &ts), ("rev", "1")]),
        )
        .await
    }
}
