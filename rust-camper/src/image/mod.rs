pub mod dl;
pub mod merge;

use crate::{
    game::cnst::Lan,
    image::{dl::download_assets, merge::merge_item_image},
};

pub async fn img_main() {
    let filter = |id: u32| {
        let id = id.to_string();
        id.starts_with("1102")
            || id.starts_with("1122")
            || id.starts_with("21")
            || id.starts_with("22")
            || id.starts_with("23")
            || id.starts_with("24")
            || id.starts_with("251")
            || id.starts_with("280")
            || id.starts_with("290")
            || id.starts_with("303")
            || id.starts_with("4610")
            || id.starts_with("463")
            || id.starts_with("5810")
    };
    download_assets(Lan::JA, filter, true).await;
    merge_item_image();
}

#[cfg(test)]
mod tests {
    use crate::file::dir::dir_cs;

    use super::*;

    #[tokio::test]
    async fn run_img_main() {
        img_main().await;
    }
    
    #[tokio::test]
    async fn test_any() {
        download_assets(Lan::JA, |id| id / 10 == 3030706, true).await;
    }

    #[test]
    fn t(){
        let path = dir_cs();
        println!("{}", path.canonicalize().unwrap().to_str().unwrap());
    }
}

/*
101: background {
    9200: 下載過場畫面
}
1102xxxx -> 支援卡全圖(小)
1122xxxx -> 支援卡全圖(大)
114: 支援卡抽到時的圖 {
    2xxxx: 支援卡ID
}
130xxxxx -> 道具設計圖
132xxxxx -> 支援卡全圖(特大) [好像沒用]
21xyyyyy: 服裝 {
    x: 差分
    y: ID
}
22xxxxxx -> 支援
23xxxxxx -> 道具
24xxxxxx -> 料理
251: 各種icon {
    01: 能交換東西的
    02: 圖鑑加屬性的
    03: 箱子類
    06: AP/YP
    07: 抽抽券
    08: 用來吃的
    51: 交換券
    70: 用具素材
    71: 料理食材
}
270: 重複服裝的碎片
280: 露營場背景 {

}
290: 狗狗 {
    1: 竹輪
    2: 其他
}

303: 全版活動告示
381700: login bonus title
392: MENU的GACHA
401: 稱號 {
    5: VIP
    7: 活動排名
}
55170006: 野外活動計畫
56100: 劇情插畫
5810: 活動說明 {
    7xx: 活動編號 {
        x: page
    }
}
651: STAMP? {
    5: VIP
    7: 活動排名
}
*/
