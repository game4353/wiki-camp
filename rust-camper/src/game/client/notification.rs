use super::Client;

impl Client {
    pub async fn req_notification(&mut self) -> Result<Vec<u8>, String> {
        self.send_get("notification", Some(vec![("flag", "6")]))
            .await
            .map_err(|err| err.to_string())
    }
}
