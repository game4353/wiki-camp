use crate::client::classes::proto::Proto;

use super::super::classes::{decode_to_class, GameResult};
use super::super::Client;

impl Client {
    pub async fn req_user_profile(&mut self, uid: u64) -> GameResult<Proto::Profile> {
        let res = self.send_post(
            "user/profile", 
            vec![
                ("uid", uid.to_string().as_str())
            ]
        ).await;
        decode_to_class(res)
    }
}
