use super::super::Client;
use crate::data::bin_dict::{decode_bytes, fixed64, vari64};
use serde_json::Value;

impl Client {
    pub async fn req_user_profileicon(
        &mut self,
        card_id: i64,
        x: i64,
        y: i64,
        rotate: i64,
        size: f64,
    ) -> reqwest::Result<Value> {
        let uid = self.uid.parse().unwrap();
        let body = profile_icon(uid, card_id, x, y, rotate, size);
        let res = self
            .send_put("user/profileicon", body)
            .await
            .map(|bytes| decode_bytes(bytes));
        res
    }
}

fn profile_icon(uid: i64, card_id: i64, x: i64, y: i64, rotate: i64, size: f64) -> Vec<u8> {
    [
        vari64(1, uid),
        vari64(2, card_id),
        vari64(3, x),
        vari64(4, y),
        vari64(4, rotate),
        fixed64(6, size),
    ]
    .concat()
}
