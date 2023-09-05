use crate::client::{
    classes::{decode_to_class, GameResult, proto::Proto::FeatureRanking},
    Client,
};

impl Client {
    pub async fn req_ranking(&mut self, fid: i32, page: i32) -> GameResult<FeatureRanking> {
        let res = self
            .send_post(
                "feature/ranking",
                vec![
                    ("feature_id", fid.to_string().as_str()),
                    ("mode", "2"),
                    ("page", page.to_string().as_str()),
                ],
            )
            .await;
        decode_to_class(res)
    }
}
