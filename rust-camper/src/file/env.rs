use dotenv::dotenv;
use std::env::var;

pub fn env_var(var_name: &str) -> String {
    if let Ok(s) = var(var_name) {
        s
    } else {        
        dotenv().unwrap();
        var(var_name).expect(&format!("Can not find env var \"{}\"", var_name))
    }
}

#[cfg(test)]
mod test {
    
    #[test]
    fn test_env_var_exists() {

    }
}