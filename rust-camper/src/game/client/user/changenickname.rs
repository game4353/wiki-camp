use crate::client::classes::{decode_to_class, proto::Proto::Nocontent, GameResult};

use super::super::Client;

impl Client {
    pub async fn req_nickname(&mut self, name: &str) -> GameResult<Nocontent> {
        let res = self
            .send_post("user/changenickname", vec![("nickname", name)])
            .await;
        decode_to_class(res)
    }
}
