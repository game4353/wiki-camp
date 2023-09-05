use super::Client;
use crate::{
    data::replace_numeric_keys::bin_to_json,
    game::cnst::{random_uuid, Lan},
};
use serde_json::Value;

impl Client {
    pub async fn req_authorize(&mut self, language: &Lan) -> reqwest::Result<Value> {
        self.add_headers(vec![("X-Enish-App-Language", language.as_str())]);
        let res = self
            .send_post("account/authorize", vec![("uuid", random_uuid())])
            .await
            .map(|v| {
                let bytes = v.clone();
                bin_to_json(bytes, "Proto::AccountAuthorize")
            });
        res
    }
}
