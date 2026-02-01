import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

async function migratePlainPasswords() {
  // Ambil semua user yang password-nya belum di-hash (tidak diawali $2b$)
  const users = await prisma.user.findMany();
  for (const user of users) {
    if (user.password && !user.password.startsWith("$2b$")) {
      const hashed = await bcrypt.hash(user.password, 10);
      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashed },
      });
      console.log(`Password user ${user.email} berhasil di-hash.`);
    }
  }
  console.log("Migrasi selesai.");
  process.exit(0);
}

migratePlainPasswords().catch((e) => {
  console.error(e);
  process.exit(1);
});
