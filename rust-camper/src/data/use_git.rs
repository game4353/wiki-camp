// https://siciarz.net/24-days-rust-git2/

use crate::{
    file::{
        dir::{dir_master_json, dir_root},
        env::env_var,
    },
    game::cnst::{Lan, Vers},
};
use std::{path::Path, process::Command};
use time;
use git2::{
    Commit, Cred, Direction, IndexAddOption, ObjectType, Oid, PushOptions, RemoteCallbacks,
    Repository, Signature,
};


pub fn auto_push(vers: &Vers) {
    let commit_message = format!("{} (auto)", vers);
    let repo_root = dir_root();
    let repo = Repository::open(repo_root).unwrap();
    add_and_commit(&repo, &commit_message).unwrap();
    let commit = find_last_commit(&repo).expect("Couldn't find last commit");
    display_commit(&commit);

    // push just never works :(
}

fn find_last_commit(repo: &Repository) -> Result<Commit, git2::Error> {
    let obj = repo.head()?.resolve()?.peel(ObjectType::Commit)?;
    obj.into_commit()
        .map_err(|_| git2::Error::from_str("Couldn't find commit"))
}

fn display_commit(commit: &Commit) {
    let timestamp = commit.time().seconds();
    let tm = time::at(time::Timespec::new(timestamp, 0));
    println!(
        "commit {}\nAuthor: {}\nDate:   {}\n\n    {}",
        commit.id(),
        commit.author(),
        tm.rfc822(),
        commit.message().unwrap_or("no commit message")
    );
}

fn add_and_commit(repo: &Repository, message: &str) -> Result<Oid, git2::Error> {
    let mut index = repo.index()?;
    index.add_all(["public/*", "data/*"].iter(), IndexAddOption::DEFAULT, None)?;
    index.write()?;
    let oid = index.write_tree()?;
    let signature = Signature::now(&env_var("GIT_USER"), &env_var("GIT_EMAIL"))?;
    let parent_commit = find_last_commit(&repo)?;
    let tree = repo.find_tree(oid)?;
    repo.commit(
        Some("HEAD"), //  point HEAD to our new commit
        &signature,   // author
        &signature,   // committer
        message,      // commit message
        &tree,        // tree
        &[&parent_commit],
    ) // parents
}

fn push(repo: &Repository, url: &str) -> Result<(), git2::Error> {
    let mut remote = match repo.find_remote("origin") {
        Ok(r) => r,
        Err(_) => repo.remote("origin", url)?,
    };
    remote.connect(Direction::Push)?;
    remote.push(&["refs/heads/master:refs/heads/master"], None)
}

fn push2(repo: &Repository) -> Result<(), git2::Error> {
    let mut remote = repo.find_remote("for_bot")?;

    // Set up credentials callback
    let mut callbacks = RemoteCallbacks::new();
    callbacks.credentials(|_url, username, _cred_type| {
        let path = env_var("GIT_SK_PATH");
        let sk = Path::new(&path);
        let pk = sk.with_extension("pub");
        Cred::ssh_key(
            username.unwrap(),
            Some(pk.as_path()),
            sk,
            Some(&env_var("GIT_SK_PW")),
        )
    });

    // Set up push options
    let mut push_options = PushOptions::new();
    push_options.remote_callbacks(callbacks);

    // Perform the push
    let refspecs = vec!["refs/heads/master:refs/heads/master"];
    remote.push(&refspecs, Some(&mut push_options))?;

    println!("Git push successful!");

    Ok(())
}

#[cfg(test)]
mod test {
    use super::*;
    use crate::{file::dir::dir_root, game::version::get_cached_ver};
    use ssh2::{Agent, HashType, Session};

    #[test]
    fn t() {
        let repo_root = dir_root();
        let repo = Repository::open(repo_root).unwrap();
        push2(&repo).unwrap();

    }

    #[test]
    fn t2() {
        let session = Session::new().unwrap();
        let mut agent = session.agent().unwrap();
        agent.connect().unwrap();
        agent.list_identities().unwrap();

        for identity in agent.identities().unwrap() {
            if env_var("GIT_USER") == identity.comment() {
                agent.userauth("git", &identity).unwrap();
                break;
            }
        }
        let mut remote = session.channel_session().unwrap();
    }
}
