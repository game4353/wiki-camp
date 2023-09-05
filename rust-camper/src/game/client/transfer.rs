use super::Client;

impl Client {
    pub async fn req_transfer(&mut self, code: &str, password: &str) -> Result<Vec<u8>, String> {
        self.send_post("account/inherit", Some(vec![
            ("uuid", RANDOM_UUID4_2),
            ("code", code),
            ("password", password),
        ]))
            .await
            .map_err(|err| err.to_string())
    }
}
