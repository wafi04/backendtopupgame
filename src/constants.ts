import * as env from 'dotenv';

env.config();

export const isProduction = process.env.APP_ENV === "production";

type DBConfig = {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
};

export const mainDB: DBConfig = {
    host: process.env.DB_MAIN_HOST as string,
    port: parseInt(process.env.DB_MAIN_PORT as string) as number,
    username: process.env.DB_MAIN_USERNAME as string,
    password: process.env.DB_MAIN_PASSWORD as string,
    database: process.env.DB_MAIN_DATABASE as string,
};

export const replicaDB: DBConfig = {
    host: process.env.DB_REPLICA_HOST as string,
    port: parseInt(process.env.DB_REPLICA_PORT as string) as number,
    username: process.env.DB_REPLICA_USERNAME as string,
    password: process.env.DB_REPLICA_PASSWORD as string,
    database: process.env.DB_REPLICA_DATABASE as string,
};
