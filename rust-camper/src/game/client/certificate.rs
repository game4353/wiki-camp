use super::{jp_timestamp, Client};
use crate::data::replace_numeric_keys::bin_to_json;
use serde_json::Value;

impl Client {
    pub async fn req_certificate(&mut self, session: &str) -> reqwest::Result<Value> {
        let ts = jp_timestamp();
        self.add_headers(vec![("X-Enish-App-Session", session)]);
        let res = self
            .send_post("account/certificate", vec![("__ts", &ts)])
            .await
            .map(|v| {
                let bytes = v.clone();
                bin_to_json(bytes, "Proto::AccountCertificate")
            });
        res
    }
}
