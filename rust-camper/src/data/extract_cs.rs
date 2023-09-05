use crate::file::dir::{dir_cs, path_dll, path_spy};
use std::{error::Error, process::Command};

pub fn extract_cs() -> Result<(), Box<dyn Error>> {
    Command::new(path_spy())
        .arg(path_dll())
        .arg("-o")
        .arg(dir_cs())
        .output()?;
    Ok(())
}
