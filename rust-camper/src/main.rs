mod data;
mod file;
mod game;
pub mod image;
#[cfg(test)]
mod test;

use data::data_main;

#[tokio::main]
async fn main() {
    data_main().await.unwrap();
}
