use crate::{
    file::{
        dir::{dir_asset, dir_image, dir_merged},
        master_json,
    },
    game::cnst::Lan,
};
use image::{open, ImageBuffer, ImageError, Rgba};
use serde_json::json;
use std::{fmt, path::PathBuf};

enum Rare {
    N,
    R,
    SR,
}

impl fmt::Display for Rare {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match *self {
            Rare::N => write!(f, "n"),
            Rare::R => write!(f, "r"),
            Rare::SR => write!(f, "sr"),
        }
    }
}

enum Atlas {
    ItemFrame,
    ItemBg,
    Rare,
}

fn atlas(tipe: Atlas, param: impl fmt::Display) -> PathBuf {
    let path = match tipe {
        Atlas::ItemFrame => "item_frame_stretched.png".to_owned(),
        Atlas::ItemBg => format!("item_bg_{}.png", param),
        Atlas::Rare => format!("rare_{}.png", param),
    };
    dir_image("atlas").join(path)
}

fn merge_item_image2(rare: Rare, item_id: u64) -> Result<(), ImageError> {
    let out_file = format!("{}.png", item_id);
    let save_path = dir_merged(out_file);
    if save_path.exists() {
        Ok(())
    } else {
        let frame_image = open(atlas(Atlas::ItemFrame, ""))?;
        let background_image = open(atlas(Atlas::ItemBg, &rare))?;
        let rare_image = open(atlas(Atlas::Rare, &rare))?;
        let item_image = open(
            dir_asset("thumbnailn")
                .join(item_id.to_string())
                .with_extension("png"),
        )?;

        let mut result = ImageBuffer::from_pixel(128, 128, Rgba([255, 255, 255, 255]));

        // Overlay the stretched frame image onto the background image
        image::imageops::overlay(&mut result, &background_image, 7, 7);
        image::imageops::overlay(&mut result, &frame_image, 4, 4);
        image::imageops::overlay(&mut result, &rare_image, 0, 0);
        image::imageops::overlay(&mut result, &item_image, 8, 8);

        result.save(save_path)
    }
}

pub fn merge_item_image() {
    master_json(Lan::JA, "gear")
        .unwrap()
        .as_array()
        .unwrap()
        .iter()
        .for_each(|o| {
            let dft = json!(0);
            let category = o.get("category").unwrap_or(&dft);
            if category.as_i64() == Some(10) {
                // do nothing for dogs
            } else {
                let rare = match o.get("rarity").unwrap().as_i64() {
                    Some(1) => Rare::N,
                    Some(2) => Rare::R,
                    Some(3) => Rare::SR,
                    _ => panic!("{:?}", o),
                };
                let rid: u64 = o.get("icon_resource_id").unwrap().as_u64().unwrap();
                match merge_item_image2(rare, rid) {
                    Ok(_) => {}
                    Err(e) => {
                        println!("[ERROR] merging {}.png: {}", rid, e);
                    }
                }
            }
        });
}
