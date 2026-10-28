/**
 * RITW CMS - Rich Text HTML Sanitizer
 * Mitigates Stored Cross-Site Scripting (XSS) in CMS content.
 */
const sanitizeHtml = require('sanitize-html');

const sanitizeOptions = {
    allowedTags: [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol',
        'nl', 'li', 'b', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'br', 'div',
        'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre', 'iframe',
        'img', 'span', 'sub', 'sup'
    ],
    allowedAttributes: {
        'a': ['href', 'name', 'target', 'rel', 'class', 'title'],
        'img': ['src', 'alt', 'title', 'width', 'height', 'class', 'style', 'loading'],
        'iframe': ['src', 'width', 'height', 'frameborder', 'allow', 'allowfullscreen', 'class'],
        '*': ['class', 'style', 'id', 'data-*']
    },
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    allowedSchemesByTag: {
        img: ['http', 'https', 'data']
    }
};

function sanitizeContent(html) {
    if (!html || typeof html !== 'string') return html;
    return sanitizeHtml(html, sanitizeOptions);
}

function sanitizeBodyMiddleware(req, res, next) {
    if (req.body && typeof req.body === 'object') {
        const fieldsToSanitize = ['content_html', 'summary', 'message', 'custom_data'];
        for (const field of fieldsToSanitize) {
            if (req.body[field] && typeof req.body[field] === 'string') {
                req.body[field] = sanitizeContent(req.body[field]);
            }
        }
    }
    next();
}

module.exports = {
    sanitizeContent,
    sanitizeBodyMiddleware
};
