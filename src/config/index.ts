import { databaseConfig } from "./database.config";

export * as databaseConfig from "./database.config"

export const config = {
  ...databaseConfig,
  migrations: [__dirname + '/src/database/migrations/**/*{.ts,.js}'],
  cli: {
    migrationsDir: 'src/database/migrations'
  }
};

