create schema if not exists "fintec";

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

create table if not exists fintec.users
(
    id      uuid primary key default uuid_generate_v1(),
    balance int,
    name    text,
    email   text unique
);

create table if not exists fintec.address
(
    user_id     uuid references fintec.users (id) unique not null,
    street      text,
    city        text,
    postal_code text,
    country     text
);

create table if not exists fintec.transaction(
    id uuid primary key default uuid_generate_v4(),
    date timestamptz not null,
    amount int not null,
    sender uuid references fintec.users(id) not null,
    recipient uuid references fintec.users(id) not null
);