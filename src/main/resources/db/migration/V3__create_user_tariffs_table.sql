CREATE TABLE user_tariffs (
    user_tariff_id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    tariff_id INTEGER REFERENCES tariffs(tariff_id) ON DELETE SET NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);