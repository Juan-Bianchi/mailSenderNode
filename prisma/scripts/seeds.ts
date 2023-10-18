// primera migracion npx prisma migrate dev --name init
// luego npx prisma migrate dev --name

import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient();

async function main() {
    try{
        await prisma.userEntity.create({
            data: {
                email: "prueba4@mail.com",
                userName:  "prueba",
                password: "prueba"
            }
        })
    }
    catch(e){
        console.error(e)
    }
    finally{
        await prisma.$disconnect()
        process.exit(1)
    }
}

main();


