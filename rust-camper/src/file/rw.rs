#![allow(dead_code)]

use serde::{Deserialize, Serialize};
use std::{
    fs,
    io::{self, Read, Write},
    path::Path,
};

/// read binary file to get list of bytes
pub fn read_bytes(file_path: impl AsRef<Path>) -> io::Result<Vec<u8>> {
    let mut file = fs::File::open(file_path)?;
    let mut buffer = Vec::new();
    file.read_to_end(&mut buffer)?;
    Ok(buffer)
}

/// read file as plain text
pub fn read_text(file_path: impl AsRef<Path>) -> io::Result<String> {
    let mut file = fs::File::open(file_path)?;
    let mut buffer = String::new();
    file.read_to_string(&mut buffer)?;
    Ok(buffer)
}

/// write file as plain text
pub fn write_text(file_path: impl AsRef<Path>, content: &str) -> io::Result<()> {
    let mut file = fs::File::create(file_path)?;
    write!(&mut file, "{}", content)?;
    Ok(())
}

/// read .json to get json_string
pub fn read_json<P, T>(file_path: P) -> io::Result<T>
where
    P: AsRef<Path>,
    T: for<'a> Deserialize<'a>,
{
    let str = read_text(file_path)?;
    let obj: T = serde_json::from_str(&str).unwrap();
    Ok(obj)
}

pub fn write_json<T, P>(dict: T, json_path: P, create_dir: u8) -> io::Result<()>
where
    T: Serialize,
    P: AsRef<Path>,
{
    let json_data = serde_json::to_string(&dict)?;
    write_file(json_data.as_bytes(), json_path, create_dir)
}

/// create_dir: how many layers of folders to create. currently over 1 means all.
pub fn write_file<P>(buf: &[u8], bin_path: P, create_dir: u8) -> io::Result<()>
where
    P: AsRef<Path>,
{
    match create_dir {
        0 => Ok(()),
        1 => bin_path
            .as_ref()
            .parent()
            .map(|p| {
                if !p.exists() {
                    fs::create_dir(p)
                } else {
                    Ok(())
                }
            })
            .unwrap_or(Ok(())),
        _ => bin_path
            .as_ref()
            .parent()
            .map(|p| {
                if !p.exists() {
                    fs::create_dir_all(p)
                } else {
                    Ok(())
                }
            })
            .unwrap_or(Ok(())),
    }?;

    // Open/create the file
    let mut file = fs::File::create(bin_path)?;

    // Write the bytes to the file
    file.write_all(buf)?;

    // Optional: Close the file to ensure data is flushed
    file.flush()
}

#[cfg(test)]
pub fn write_debug<T>(obj: &T, file_path: &str) -> io::Result<()>
where
    T: std::fmt::Debug,
{
    let mut file = fs::File::create(file_path)?;
    write!(&mut file, "{:?}", obj)?;
    Ok(())
}
