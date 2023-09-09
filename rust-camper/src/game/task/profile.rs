use crate::game::{client::Client, cnst::Lan};
use std::error::Error;

pub async fn set_profile_icon(
    card_id: i64,
    x: i64,
    y: i64,
    rotate: i64,
    size: f64,
) -> Result<(), Box<dyn Error>> {
    // 768 x 432
    assert!(size + (x as f64) <= 768.0);
    assert!(size + (y as f64) <= 432.0);
    assert!(size >= 120.0);

    let mut client = Client::account(1);
    client.login("", Lan::JA).await?;
    let res = client
        .req_user_profileicon(card_id, x, y, rotate, size)
        .await?;
    println!("{:?}", res);
    Ok(())
}
