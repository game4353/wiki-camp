use data::data_main;

mod data;
mod file;
mod game;
pub mod image;

#[tokio::main]
async fn main() {
    data_main().await.unwrap();
}
