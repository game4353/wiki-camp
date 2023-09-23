use crate::{
    game::{cnst::Lan, client::Client}, file::read_user_dbs,
};

pub async fn search_support(find_green: i64) {
    let mut client = Client::account(1);
    client.login("", Lan::JA).await.unwrap();
    for uid in read_user_dbs() {
        let res = client.req_user_profile(uid).await.unwrap();

        let friend_id = res["uid"].as_u64().unwrap();

        // let support_card = res["camp_support"];
        // let sup_id = support_card["card_id.unwrap"];
        // let sup_lv = support_card["level"];
        // let rank_lv = support_card.get("awake_rank").unwrap_or(0);

        // if sup_id == support_id && sup_lv > 15 {
        //     println!("{} lv:{} rank:{}", friend_id, sup_lv, rank_lv);
        // }

        let report = res.get("camp_report");
        if report.is_none() { continue; }
        let report = report.unwrap();
        let green = report.get("green_secret");
        if green.is_none() { continue; }
        let green = green.unwrap().as_i64().unwrap_or(0);
        if green == find_green {
                println!("{}", friend_id);
        }
    }
}

#[cfg(test)]
mod test {
    use super::*;

    #[tokio::test]
    async fn test_any() {
        super::search_support(312372).await;
    }

    #[tokio::test]
    async fn test_b() {
        let mut client = Client::account(1);
        client.login("", Lan::JA).await.unwrap();
        let res = client.req_user_profile(5713202).await.unwrap();
        println!("{:#?}", res);
    }
}