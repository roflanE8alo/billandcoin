CREATE TABLE user_profiles (
    profile_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    balance DECIMAL(10,2) DEFAULT 0.00,
    details TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);