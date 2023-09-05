use super::super::{cnst::random_uuid, Client};
use crate::client::classes::{decode_to_class, proto::Proto::AuthorizeInheritPassword, GameResult};

impl Client {
    pub async fn req_generate(&mut self, password: &str) -> GameResult<AuthorizeInheritPassword> {
        let res = self
            .send_post(
                "account/inherit/password",
                vec![("uuid", random_uuid()), ("password", password)],
            )
            .await;
        decode_to_class(res)
    }
}
