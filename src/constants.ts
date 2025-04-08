import * as env from 'dotenv';

env.config();

export const isProduction = process.env.APP_ENV === "production";

