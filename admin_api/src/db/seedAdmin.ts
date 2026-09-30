import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { pool } from './connection';
import logger from '../utils/logger';

async function seedAdmin(): Promise<void> {
  const email = 'admin@aashrayinfotech.com';
  const password = 'Admin@Aashray2026!'; // Change this immediately after first login
  const name = 'Super Admin';

  const passwordHash = await bcrypt.hash(password, 12);
  const id = uuidv4();

  const [existing] = await pool.execute(
    'SELECT id FROM users WHERE email = ?',
    [email]
  ) as [{ id: string }[], unknown];

  if (existing.length > 0) {
    logger.info(`Admin with email ${email} already exists — skipping seed`);
    await pool.end();
    return;
  }

  await pool.execute(
    `INSERT INTO users (id, name, email, password_hash, role) VALUES (?, ?, ?, ?, ?)`,
    [id, name, email, passwordHash, 'SUPER_ADMIN']
  );

  logger.info(`✅ Admin seeded:`);
  logger.info(`   Email: ${email}`);
  logger.info(`   Password: ${password}`);
  logger.info(`   ⚠️  Change the password immediately after first login!`);
  await pool.end();
}

seedAdmin().catch((err) => {
  logger.error(err);
  process.exit(1);
});
