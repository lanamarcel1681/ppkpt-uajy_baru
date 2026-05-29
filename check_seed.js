const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
async function main() {
    const role = await prisma.role.findUnique({ where: { id_role: 2 } });
    const user = await prisma.pengurus.findUnique({ where: { email_pengurus: "satgas1@uajy.ac.id" } });
    const result = { role, user };

    const fs = require('fs');
    fs.writeFileSync('verification_result.txt', JSON.stringify(result, null, 2));
}
main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
