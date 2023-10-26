import { PrismaClient } from '@prisma/client';

const state: string | undefined = process.env.APP_STATE;
const database_url = (() => {
    switch (state) {
        case 'testUnit':
        case 'testInt':
            return process.env.DATABASE_TEST_URL;
        case 'dev':
            return process.env.DATABASE_DEV_URL;
        default: 
            return process.env.DATABASE_PROD_URL;
    }
})();

const prisma = new PrismaClient({ datasources: { db: { url: `${database_url}`}}});

export default prisma;