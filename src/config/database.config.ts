import * as env from 'dotenv'
import { isProduction, mainDB, replicaDB } from "src/constants";


env.config();

export const databaseConfig = {
    type: "postgres",
    host: mainDB.host,
    port: mainDB.port,
    username: mainDB.username,
    password: mainDB.password,
    database: mainDB.database,
    entities: [__dirname + "/../**/*.entity{.ts,.js}"],
    synchronize: !isProduction,
    logging: !isProduction,
    replication: process.env.DB_REPLICATION === 'true' ? {
        master: {
            host: mainDB.host,
            port: mainDB.port,
            username: mainDB.username,
            password: mainDB.password,
            database: mainDB.database,
        },
        slaves: [
            {
                host: replicaDB.host,
                port: replicaDB.port,
                username: replicaDB.username,
                password: replicaDB.password,
                database: replicaDB.database,
            }
        ]
    } : undefined,
    ...(isProduction ? {
        migrationsRun: true,
        migrations: [__dirname + '/../migrations/**/*{.ts,.js}'],
    } : {})
};

