use super::super::Client;
use crate::data::replace_numeric_keys::bin_to_json;
use serde_json::Value;

impl Client {
    pub async fn req_user_profile(&mut self, uid: u64) -> reqwest::Result<Value> {
        let res = self
            .send_post("user/profile", vec![("uid", uid.to_string().as_str())])
            .await
            .map(|v| {
                let bytes = v.clone();
                bin_to_json(bytes, "Proto::Profile")
            });
        res
    }
}
