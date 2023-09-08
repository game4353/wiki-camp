use super::Client;
use crate::data::replace_numeric_keys::bin_to_json;
use serde_json::Value;

impl Client {
    pub async fn req_ranking(&mut self, fid: i32, page: i32) -> reqwest::Result<Value> {
        let res = self
            .send_post(
                "feature/ranking",
                vec![
                    ("feature_id", fid.to_string().as_str()),
                    ("mode", "2"),
                    ("page", page.to_string().as_str()),
                ],
            )
            .await
            .map(|v| {
                let bytes = v.clone();
                bin_to_json(bytes, "Proto::FeatureRanking")
            });
        res
    }
}
