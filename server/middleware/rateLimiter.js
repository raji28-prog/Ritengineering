/**
 * RITW CMS - In-Memory Brute-Force Rate Limiter
 * Specifically guards login endpoints against credential stuffing and brute-force attacks.
 */
const config = require('../config');

const failedAttempts = new Map(); // ip -> { count, firstAttemptTime, blockedUntil }

function loginRateLimiter(req, res, next) {
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    const now = Date.now();

    const record = failedAttempts.get(ip);

    if (record) {
        // If currently blocked
        if (record.blockedUntil && now < record.blockedUntil) {
            const remainingMinutes = Math.ceil((record.blockedUntil - now) / 60000);
            return res.status(429).json({
                success: false,
                message: `Too many failed login attempts. IP temporarily locked. Please try again in ${remainingMinutes} minute(s).`
            });
        }

        // If window has passed, reset
        if (now - record.firstAttemptTime > config.RATE_LIMIT_LOGIN_WINDOW_MS) {
            failedAttempts.delete(ip);
        }
    }

    // Helper functions to be called by login route
    req.recordFailedLogin = () => {
        const current = failedAttempts.get(ip) || { count: 0, firstAttemptTime: now, blockedUntil: null };
        current.count += 1;
        if (current.count >= config.RATE_LIMIT_LOGIN_MAX) {
            current.blockedUntil = now + config.RATE_LIMIT_LOGIN_WINDOW_MS;
            console.warn(`[SECURITY] IP ${ip} has exceeded max failed login attempts. Blocked for 15 minutes.`);
        }
        failedAttempts.set(ip, current);
    };

    req.clearFailedLogin = () => {
        failedAttempts.delete(ip);
    };

    next();
}

module.exports = loginRateLimiter;
