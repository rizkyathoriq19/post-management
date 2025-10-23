import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

async function setupDatabaseExtensions() {
  await prisma.$executeRawUnsafe(`
    CREATE EXTENSION IF NOT EXISTS pgcrypto;
  `);
}

async function setupPasswordTrigger() {
  await prisma.$executeRawUnsafe(`
    CREATE OR REPLACE FUNCTION hash_password_function()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.password := crypt(NEW.password, gen_salt('bf')); 
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `);

  await prisma.$executeRawUnsafe(`
    DO $$ 
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'hash_password_trigger') THEN
        CREATE TRIGGER hash_password_trigger
        BEFORE INSERT OR UPDATE ON "users"
        FOR EACH ROW
        EXECUTE FUNCTION hash_password_function();
      END IF;
    END $$;
  `);
}

async function setupSoftDeleteTrigger() {
  await prisma.$executeRawUnsafe(`
    CREATE OR REPLACE FUNCTION soft_delete_users()
    RETURNS TRIGGER AS $$
    BEGIN
      UPDATE users SET deleted_at = NOW() WHERE id = OLD.id;
      RETURN NULL;
    END;
    $$ LANGUAGE plpgsql;
  `);

  await prisma.$executeRawUnsafe(`
    DO $$ 
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'soft_delete_users_trigger') THEN
        CREATE TRIGGER soft_delete_users_trigger
        BEFORE DELETE ON users
        FOR EACH ROW
        EXECUTE FUNCTION soft_delete_users();
      END IF;
    END $$;
  `);
}

async function setupDatabase() {
  try {
    await setupDatabaseExtensions();
    await setupPasswordTrigger();
    await setupSoftDeleteTrigger();
    console.log("✅ Database setup successfully");
  } catch (err) {
    console.error("❌ Error setting up database:", err);
  }
}

setupDatabase();