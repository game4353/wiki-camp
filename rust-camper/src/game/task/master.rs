use crate::{
    file::{
        dir::{dir_master_json, dir_resource_json},
        rw::write_file,
    },
    game::{
        client::Client,
        cnst::{Lan, Vers},
        version::get_cached_ver,
    },
};
use std::error::Error;

/// download master & resource of 4 languages
///
/// return new_vers
pub async fn download_master_and_resource(version: &str) -> Result<Vers, Box<dyn Error>> {
    let old_vers = get_cached_ver();
    let mut new_vers = Vers::default();
    for lan in Lan::all() {
        let mut client = Client::account(1);
        let (vers, master_bytes, resource_bytes) = client.login(version, lan).await?;

        new_vers = vers.clone();
        if vers == old_vers {
            break;
        }
        let master_path = dir_master_json(&lan);
        write_file(&master_bytes[..], &master_path, 1)?;

        let resource_path = dir_resource_json(&lan);
        write_file(&resource_bytes[..], &resource_path, 1)?;
    }
    Ok(new_vers)
}

#[cfg(test)]
mod test {
    use super::*;

    #[test]
    fn test_any() {
        let old = get_cached_ver();
        let n = Vers {
            application: "1.8.461".to_string(),
            resource: 11159,
            master: 5958,
        };
        assert_eq!(old, n);
    }
}
