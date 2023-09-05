use std::{path::Path, fmt};

#[derive(Debug, Copy, Clone, PartialEq, Eq)]
pub struct Lan(&'static str);

impl Lan {
    pub const JA: Lan = Lan("ja");
    pub const TW: Lan = Lan("zh-TW");
    pub const EN: Lan = Lan("en");
    pub const KO: Lan = Lan("ko");

    pub fn all() -> [Lan; 4] {
        [Lan::JA, Lan::TW, Lan::EN, Lan::KO]
    }

    pub fn as_str(&self) -> &'static str {
        &self.0
    }
}

impl AsRef<Path> for Lan {
    fn as_ref(&self) -> &Path {
        self.as_str().as_ref()
    }
}

/// currently just returns a fixed uuid
pub fn random_uuid() -> &'static str {
    "fe3927b0-efe4-47ca-acd0-6a808c077429"
}

#[derive(Debug, Eq, PartialEq, Default, Clone)]
pub struct Vers {
    pub application: String,
    pub resource: i32,
    pub master: i32,
}

impl fmt::Display for Vers {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{} / {} / {}", self.application, self.resource, self.master)
    }
}
