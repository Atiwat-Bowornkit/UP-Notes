// Usage: npm run db:make-admin -- someone@up.ac.th
// Gives that email the ADMIN role (creates the User row if it does not exist yet).
const { PrismaClient } = require('@prisma/client');

const email = process.argv[2];
if (!email || !email.includes('@')) {
    console.error('Usage: npm run db:make-admin -- <email>');
    process.exit(1);
}

const prisma = new PrismaClient();
prisma.user
    .upsert({
        where: { email },
        create: { email, role: 'ADMIN' },
        update: { role: 'ADMIN' },
        select: { email: true, role: true },
    })
    .then((user) => console.log(`${user.email} is now ${user.role}`))
    .catch((err) => {
        console.error(err.message);
        process.exitCode = 1;
    })
    .finally(() => prisma.$disconnect());
