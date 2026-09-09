const crypto = require('crypto');
const User = require('../models/User');

const tokenSecret = () => process.env.AUTH_TOKEN_SECRET || process.env.ADMIN_KEY || 'admin123';

function createToken(user) {
  const payload = Buffer.from(JSON.stringify({ id: user._id.toString(), email: user.email, role: user.role, exp: Date.now() + (7 * 24 * 60 * 60 * 1000) })).toString('base64url');
  const signature = crypto.createHmac('sha256', tokenSecret()).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

async function authenticateToken(req, res, next) {
  try {
    const authorization = req.headers.authorization || '';
    const [payload, signature] = authorization.replace('Bearer ', '').split('.');
    if (!payload || !signature) return res.status(401).json({ success: false, message: 'Authentication required' });
    const expected = crypto.createHmac('sha256', tokenSecret()).update(payload).digest('base64url');
    if (signature.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return res.status(401).json({ success: false, message: 'Invalid authentication token' });
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString());
    if (!decoded.exp || decoded.exp < Date.now()) return res.status(401).json({ success: false, message: 'Authentication token expired' });
    req.user = await User.findById(decoded.id).select('_id email role');
    if (!req.user) return res.status(401).json({ success: false, message: 'User not found' });
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Invalid authentication token' });
  }
}

module.exports = { authenticateToken, createToken };