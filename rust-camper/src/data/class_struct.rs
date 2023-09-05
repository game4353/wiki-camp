use crate::file::{dir::dir_cs, rw::read_text};
use lazy_static::lazy_static;
use regex::Regex;
use std::{collections::HashMap, iter, sync::{Mutex, Arc}, io};

lazy_static! {
    static ref CSS: Mutex<HashMap<String, Arc<ClassStruct>>> = Mutex::new(HashMap::default());
}

#[derive(Debug, Default)]
pub struct ClassStruct {
    pub namespace: String,
    pub class: String,
    pub prop_names: Vec<String>,
    pub prop_types: Vec<String>,
    pub enums: Vec<String>,
    pub use_spaces: Vec<String>,
}

impl ClassStruct {
    pub fn fetch(class_type: &str) -> Arc<ClassStruct> {
        let mut css = CSS.lock().unwrap();
        if !css.contains_key(class_type) {
            let mut s = class_type.split("::");
            let namespace = s.next().unwrap();
            let class = s.next().unwrap();
            let v = ClassStruct::new(namespace, class);
            css.insert(class_type.to_string(), Arc::new(v));

        }
        Arc::clone(css.get(class_type).unwrap())
    }

    pub fn new(namespace: &str, class: &str) -> ClassStruct {
        let mut cs = ClassStruct::default();
        cs.namespace = namespace.to_string();
        cs.class = class.to_string();

        let text =
            read_cs2(namespace, class).expect(&format!("can not find {}/{}", namespace, class));
        // prop
        Regex::new(r"(?ms)ProtoMember\((\d+).*?\).+?public (\S+(?:, )?\S+) (\S+)")
            .unwrap()
            .captures_iter(&text)
            .for_each(|c| {
                let idx: usize = c[1].to_string().parse().unwrap();
                let tipe = c[2].to_string();
                let name = c[3].to_string();
                cs.insert_prop(idx, name, tipe);
            });

        // enum
        Regex::new(r"public enum Enum([^}]+)")
            .unwrap()
            .captures(&text)
            .map(|c| {
                let enum_content = c.get(1).unwrap();
                Regex::new(r"(?m)^\s*(\w+)")
                    .unwrap()
                    .captures_iter(enum_content.into())
                    .for_each(|c| {
                        let enum_string = c[1].to_string();
                        cs.enums.push(enum_string);
                    });
            });

        // using
        Regex::new(r"using (Pcommon|Pmaster|Pmisc|Prealtime|Proto|Puser);")
            .unwrap()
            .captures_iter(&text)
            .for_each(|c| {
                let space = c[1].to_string();
                cs.use_spaces.push(space);
            });

        cs
    }

    fn insert_prop(&mut self, idx: usize, name: String, tipe: String) {
        if idx >= self.prop_names.len() {
            self.prop_names.resize(idx + 1, "".to_owned());
            self.prop_types.resize(idx + 1, "".to_owned());
        }
        let name = if name.starts_with("@") {
            name[1..].to_string()
        } else {
            name
        };
        self.prop_names[idx] = name;
        self.prop_types[idx] = tipe;
    }

    pub fn change_type(&self, t: &str) -> String {
        match t {
            "" => "".to_string(),
            "bool" => "bool".to_string(),
            "byte" => "u8".to_string(),
            "int" => "i32".to_string(),
            "uint" => "u32".to_string(),
            "long" => "i64".to_string(),
            "float" => "f32".to_string(),
            "double" => "f64".to_string(),
            "string" => "String".to_string(),
            s if s.ends_with("[]") => format!("Vec<{}>", self.change_type(&s[..s.len() - 2])),
            s if s.starts_with("List<") => format!("Vec<{}>", self.change_type(&s[5..s.len() - 1])),
            s if s.starts_with("Dictionary<") => {
                let c = Regex::new(r"^Dictionary<(.+?), (.+)>$")
                    .unwrap()
                    .captures(s)
                    .unwrap();
                let k1 = self.change_type(&c[1]);
                let k2 = self.change_type(&c[2]);
                format!("HashMap<{}, {}>", k1, k2)
            }
            s if s.ends_with(".Enum") => self.change_type(&s[..s.len() - 5]),
            s if s.starts_with("global::") => {
                let c = Regex::new(r"^global::(.+?)\.(.+)$")
                    .unwrap()
                    .captures(s)
                    .unwrap();
                format!("{}::{}", &c[1], &c[2])
            }
            s if s.contains(".") => {
                s.replace(".", "::")
            }
            rest => self.use_spaces.iter()
                .chain(iter::once(&self.namespace))
                .find_map(|namespace| {
                    if exist_class(namespace, rest) {
                        Some(format!("{}::{}", namespace, rest))
                    } else {
                        None
                    }
                })
                .expect(&format!("unknown type: '{}'", rest)),
        }
    }

    pub fn get_rs_type(&self, index: usize) -> String {
        self.change_type(&self.prop_types[index])
    }
}

fn exist_class(namespace: &str, class: &str) -> bool {
    dir_cs()
        .join("proto")
        .join(namespace)
        .join(class)
        .with_extension("cs")
        .exists()
}

fn read_cs2(namespace: &str, class: &str) -> io::Result<String> {
    let file_path = dir_cs()
        .join("proto")
        .join(namespace)
        .join(class)
        .with_extension("cs");
    read_text(file_path)
}
