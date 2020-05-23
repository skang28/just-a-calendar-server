CREATE TABLE jac_users (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    account_name TEXT NOT NULL,
    account_password TEXT NOT NULL
);

CREATE TABLE events (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    title TEXT NOT NULL,
    location TEXT,
    start_date_time TIMESTAMP NOT NULL,
    end_date_time TIMESTAMP NOT NULL,
    description TEXT,
    user_id INTEGER REFERENCES jac_users(id) ON DELETE CASCADE NOT NULL
);