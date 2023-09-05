use crate::file::env::env_var;

use super::client::Client;

impl Client {
    pub fn account(index: usize) -> Self {
        match index {
            1 => {
                let uid = env_var("ACC_UID_1");
                let uuid = env_var("ACC_UUID_1");
                Client::new(uid, uuid)
            }
            _ => panic!("Account {} does not exist.", index),
        }
    }
}
