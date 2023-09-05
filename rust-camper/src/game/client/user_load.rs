use super::super::classes::{decode_to_class, GameResult};
use super::super::Client;
use crate::client::classes::proto::Proto::Nocontent;

impl Client {
    pub async fn req_user_load(&mut self) -> GameResult<Nocontent> {
        let res = self.send_get("user/load", None).await;
        decode_to_class(res)
    }
}
