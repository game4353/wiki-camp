use super::{jp_timestamp, Client};
use crate::game::cnst::Vers;

impl Client {
    async fn master(&mut self, master: i32, resource: i32) -> reqwest::Result<Vec<u8>> {
        let ts = jp_timestamp();
        let uid = self.uid.clone();
        self.add_headers(vec![
            ("X-Enish-App-Version-Master", &master.to_string()),
            ("X-Enish-App-Version-Resource", &resource.to_string()),
        ]);
        self.send_get(
            "master/all",
            Some(vec![("__uid", &uid), ("__ts", &ts), ("version", "1")]),
        )
        .await
    }

    pub async fn req_master(&mut self, vers: &Vers) -> reqwest::Result<Vec<u8>> {
        self.master(vers.master, vers.resource).await
    }
}
