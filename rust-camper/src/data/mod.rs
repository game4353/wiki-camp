pub mod bin_dict;
pub mod class_struct;
mod extract_cs;
// mod name_master;
pub mod replace_numeric_keys;
mod use_git;

use self::{extract_cs::extract_cs, replace_numeric_keys::bin_to_json, use_git::auto_push};
use crate::{
    file::{
        dir::{dir_master_json, path_json_asset},
        rw::write_json,
    },
    game::{client::Client, cnst::Lan, version::get_cached_ver},
    image::img_main,
};
use std::error::Error;

pub async fn data_main() -> Result<(), Box<dyn Error>> {
    for lan in Lan::all() {
        // step 1: get cached version
        let old_vers = get_cached_ver(lan);

        // step 2: obtain binary
        let mut client = Client::account(1);
        let (new_vers, master_bytes, resource_bytes) = client.login("", lan).await?;

        // step 3: parse .dll to .cs
        if old_vers.application != new_vers.application {
            extract_cs()?;
        }

        // step 4: read master binary & write sub master json
        if old_vers != new_vers {
            let json = bin_to_json(master_bytes, "Pmaster::All");
            let folder = dir_master_json(&lan);
            json.as_object().unwrap().iter().try_for_each(|(k, v)| {
                let path = folder.join(k).with_extension("json");
                write_json(v, path, 0)?;
                Ok::<(), Box<dyn Error>>(())
            })?;
        }

        // step 5: read resource binary & write resource json
        // step 6: download assets
        if lan == Lan::JA && old_vers.resource != new_vers.resource {
            let json = bin_to_json(resource_bytes, "Pcommon::Resources");
            let path = path_json_asset(&lan);
            write_json(json, path, 0)?;
            img_main().await;
        }

        // step 7: run some git push
        if old_vers != new_vers {
            auto_push(lan, &new_vers);
        }
    }
    Ok(())
}

#[cfg(test)]
mod test {
    use crate::game::{version::get_cached_ver, cnst::Lan};

    
    #[test]
    fn t() {
        println!("{}", get_cached_ver(Lan::JA).to_string());
    }
}