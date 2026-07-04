import mongoose from 'mongoose';

/**
 * One-time migration: fix any leftover state from older versions.
 * Runs on every server start — safe to call repeatedly.
 */
export async function runMigrations() {
  try {
    const User = mongoose.connection.collection('users');
    const indexes = await User.indexes();
    const indexNames = indexes.map(i => i.name);

    // Drop the old "phone_1" unique index from the passkey-era User model
    if (indexNames.includes('phone_1')) {
      console.log('🔧 Migrating: dropping legacy "phone_1" index from users collection…');
      await User.dropIndex('phone_1');
      console.log('✅ Dropped "phone_1" index');
    }

    // Ensure the new "email_1" index exists and is unique
    if (!indexNames.includes('email_1')) {
      console.log('🔧 Migrating: creating "email_1" unique index…');
      await User.createIndex({ email: 1 }, { unique: true });
      console.log('✅ Created "email_1" index');
    }

    // Remove any orphan users that lack an email (from the old passkey version)
    const orphanResult = await User.deleteMany({ email: { $exists: false } });
    if (orphanResult.deletedCount > 0) {
      console.log(`🧹 Cleaned up ${orphanResult.deletedCount} orphan user(s) without email`);
    }

    // Drop any leftover Otp/Challenge collections from old versions
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collNames = collections.map(c => c.name);
    for (const oldName of ['challenges']) {
      if (collNames.includes(oldName)) {
        await mongoose.connection.db.dropCollection(oldName);
        console.log(`🧹 Dropped legacy collection: ${oldName}`);
      }
    }

    console.log('✅ Migrations complete');
  } catch (err) {
    console.error('⚠️  Migration error (non-fatal):', err.message);
  }
}
