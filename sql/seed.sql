
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT CHECK(role IN ('rep','manager')) DEFAULT 'rep',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS leads (
  id TEXT PRIMARY KEY,
  owner_id TEXT NOT NULL REFERENCES users(id),
  name TEXT NOT NULL,
  company TEXT,
  status TEXT CHECK(status IN ('new','working','qualified','disqualified')) DEFAULT 'new',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS accounts (
  id TEXT PRIMARY KEY,
  owner_id TEXT NOT NULL REFERENCES users(id),
  name TEXT NOT NULL,
  industry TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS activities (
  id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id),
  type TEXT CHECK(type IN ('call','email','demo')),
  notes TEXT,
  next_follow_up DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

/* bcrypt hash for 'Password1!' */
INSERT OR IGNORE INTO users (id,email,password_hash,role) VALUES
('u1','alice@corp.com','$2b$10$LRb6Sk4mJqqljoNV2KqB7el8R/Q9ZLf9rObmhZEC4sSLaS4L4JFfG','manager'),
('u2','bob@corp.com','$2b$10$LRb6Sk4mJqqljoNV2KqB7el8R/Q9ZLf9rObmhZEC4sSLaS4L4JFfG','rep');

INSERT OR IGNORE INTO leads (id,owner_id,name,company,status) VALUES
('l1','u2','Charlie','Acme Inc','working');

INSERT OR IGNORE INTO accounts (id,owner_id,name,industry) VALUES
('a1','u2','Acme Inc','Manufacturing');

INSERT OR IGNORE INTO activities (id,account_id,user_id,type,notes) VALUES
('act1','a1','u2','call','Intro call--good fit!');