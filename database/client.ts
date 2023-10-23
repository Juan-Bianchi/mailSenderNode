import { PrismaClient } from '@prisma/client';

const state: string | undefined = process.env.APP_STATE;
const database_url: string | undefined = state != 'test'? process.env.DATABASE_DEV_URL: process.env.DATABASE_TEST_URL;
console.log(database_url)
const prisma = new PrismaClient({ datasources: { db: { url: `${database_url}`}}});

export default prisma;