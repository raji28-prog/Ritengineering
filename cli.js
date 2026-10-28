#!/usr/bin/env node
/**
 * RITW Dynamic CMS - Administrative Command Line Management Tool
 * Usage:
 *   node cli.js init-admin <username> <password>
 *   node cli.js change-password <username> <new_password>
 *   node cli.js list-users
 */

const bcrypt = require('bcryptjs');
const db = require('./server/db/database');
const seed = require('./server/db/seed');

const command = process.argv[2];
const arg1 = process.argv[3];
const arg2 = process.argv[4];

function showHelp() {
    console.log(`
==================================================================
           RITW DYNAMIC CMS MANAGEMENT CLI
==================================================================
Commands:
  node cli.js init-admin <username> <password>
      Create or update the initial administrator account.

  node cli.js change-password <username> <new_password>
      Update an existing administrator's password securely.

  node cli.js list-users
      List all existing system users and active statuses.

  node cli.js reset-db
      Re-run database schema migrations and seed initial data.
==================================================================
    `);
}

switch (command) {
    case 'init-admin': {
        if (!arg1 || !arg2) {
            console.error('Error: Username and password are required.');
            console.log('Usage: node cli.js init-admin <username> <password>');
            process.exit(1);
        }
        const username = arg1.trim();
        const password = arg2.trim();
        if (password.length < 8) {
            console.error('Error: Password must be at least 8 characters long.');
            process.exit(1);
        }

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        const existing = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
        if (existing) {
            db.prepare('UPDATE users SET password_hash = ?, is_active = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(hash, existing.id);
            console.log(`[SUCCESS] Admin user "${username}" password updated successfully.`);
        } else {
            db.prepare(`
                INSERT INTO users (username, email, password_hash, role, is_active)
                VALUES (?, ?, ?, 'admin', 1)
            `).run(username, `${username}@rishimsengg.ac.in`, hash);
            console.log(`[SUCCESS] Administrator "${username}" created successfully.`);
        }
        break;
    }

    case 'change-password': {
        if (!arg1 || !arg2) {
            console.error('Error: Username and new password are required.');
            console.log('Usage: node cli.js change-password <username> <new_password>');
            process.exit(1);
        }
        const username = arg1.trim();
        const password = arg2.trim();
        if (password.length < 8) {
            console.error('Error: Password must be at least 8 characters long.');
            process.exit(1);
        }

        const user = db.prepare('SELECT id FROM users WHERE username = ?').get(username);
        if (!user) {
            console.error(`Error: User "${username}" not found.`);
            process.exit(1);
        }

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        db.prepare('UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(hash, user.id);
        console.log(`[SUCCESS] Password changed successfully for user "${username}".`);
        break;
    }

    case 'list-users': {
        const users = db.prepare('SELECT id, username, email, role, is_active, last_login, created_at FROM users').all();
        console.log('\n--- RITW CMS User Accounts ---');
        console.table(users);
        break;
    }

    case 'reset-db': {
        console.log('Re-running seeder...');
        seed();
        console.log('[SUCCESS] Database initialized and seeded.');
        break;
    }

    default:
        showHelp();
        break;
}
