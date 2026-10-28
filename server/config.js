/**
 * RITW Dynamic CMS - Server Configuration
 */
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

// Lightweight .env reader if dotenv is not installed
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split(/\r?\n/).forEach(line => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#')) {
            const idx = trimmed.indexOf('=');
            if (idx > -1) {
                const key = trimmed.substring(0, idx).trim();
                const val = trimmed.substring(idx + 1).trim().replace(/^['"]|['"]$/g, '');
                if (!process.env[key]) {
                    process.env[key] = val;
                }
            }
        }
    });
}

// Generate or use stable JWT secret for dev if not supplied
const defaultSecret = crypto.createHash('sha256').update('ritw-cms-default-secure-secret-2026').digest('hex');

module.exports = {
    PORT: parseInt(process.env.PORT || '5000', 10),
    JWT_SECRET: process.env.JWT_SECRET || defaultSecret,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '2h',
    DB_PATH: process.env.DB_PATH || path.join(__dirname, 'db', 'ritw_cms.sqlite'),
    UPLOAD_DIR: path.join(__dirname, '..', 'uploads', 'media'),
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_MIME_TYPES: [
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/svg+xml',
        'image/gif',
        'application/pdf'
    ],
    RATE_LIMIT_LOGIN_MAX: 5, // Max 5 failed attempts
    RATE_LIMIT_LOGIN_WINDOW_MS: 15 * 60 * 1000 // 15 minutes window
};
