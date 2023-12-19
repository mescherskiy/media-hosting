-- INSERT INTO roles (name)
-- SELECT 'ROLE_USER' WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'ROLE_USER');
-- INSERT INTO roles (name)
-- SELECT 'ROLE_ADMIN' WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'ROLE_ADMIN');

-- CREATE TABLE IF NOT EXISTS roles (id SERIAL PRIMARY KEY, name VARCHAR(255) NOT NULL);
--
-- INSERT INTO roles (name) VALUES ('ROLE_USER') ON CONFLICT (name) DO NOTHING;
-- INSERT INTO roles (name) VALUES ('ROLE_ADMIN') ON CONFLICT (name) DO NOTHING;

-- Создание таблицы roles, если её нет
CREATE TABLE IF NOT EXISTS roles (
                                     id SERIAL PRIMARY KEY,
                                     name VARCHAR(255) NOT NULL
    );

-- Добавление ролей, если их нет
INSERT INTO roles (name)
SELECT 'ROLE_USER' WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'ROLE_USER');

INSERT INTO roles (name)
SELECT 'ROLE_ADMIN' WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'ROLE_ADMIN');
