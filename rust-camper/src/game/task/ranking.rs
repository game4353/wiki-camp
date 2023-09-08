use super::super::{client::Client, cnst::Lan};
use crate::file::{dir::dir_ranking_json, rw::write_json};
use std::error::Error;

/// download rank data to <data_folder>/ranking/{fid}/page{page}.json
async fn download_rank_page(
    client: &mut Client,
    fid: i32,
    page: i32,
) -> Result<(), Box<dyn Error>> {
    let res = client.req_ranking(fid, page).await?;
    let ranking = &res["ranking"];
    let json_path = dir_ranking_json(fid).join(format!("page{}.json", page));
    write_json(ranking, json_path, 2)?;
    Ok(())
}

/// download some rank data to <data_folder>/ranking/{fid}/
pub async fn download_rank(fid: i32) -> Result<(), Box<dyn Error>> {
    let mut client = Client::account(1);
    client.login("", Lan::JA).await?;
    for page in 1..=50 {
        download_rank_page(&mut client, fid, page).await?;
    }
    for page in [100, 300, 500] {
        download_rank_page(&mut client, fid, page).await?;
    }
    Ok(())
}
