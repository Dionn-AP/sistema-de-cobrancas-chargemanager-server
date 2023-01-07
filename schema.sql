DROP TABLE IF EXISTS users;

CREATE TABLE users (
	id SERIAL PRIMARY KEY,
  	name VARCHAR(250) NOT NULL,
  	email TEXT UNIQUE NOT NULL,
  	password TEXT NOT NULL,
  	cpf VARCHAR(11),
  	telephone VARCHAR(11)
);

DROP TABLE IF EXISTS customers;

CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(250) NOT NULL,
  cpf VARCHAR(11) UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  telephone VARCHAR(11) UNIQUE NOT NULL,
  address TEXT,
  compliment TEXT,
  cep VARCHAR(8),
  district TEXT,
  city TEXT,
  state TEXT,
  user_id INT REFERENCES users(id)
);

DROP TABLE IF EXISTS charges;

CREATE TABLE charges (
  id SERIAL PRIMARY KEY,
  description VARCHAR(250) NOT NULL,
  status TEXT DEFAULT 'pendente' NOT NULL,
  amount INT NOT NULL,
  expiration TIMESTAMPTZ NOT NULL,
  customer_id INT REFERENCES customers(id)
);