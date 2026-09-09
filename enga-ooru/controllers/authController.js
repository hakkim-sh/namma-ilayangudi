const User = require('../models/User');
const { createToken } = require('../middleware/auth');
const adminKey = () => process.env.ADMIN_KEY || 'admin123';

const responseFor = (user) => ({ id: user._id, email: user.email, role: user.role, token: createToken(user) });

const googleLogin = async (req, res, next) => {
  try {
    const credential = String(req.body.credential || '');
    if (!credential) return res.status(400).json({ success: false, message: 'Google sign-in credential is required.' });
    const googleResponse = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`);
    const googleUser = await googleResponse.json();
    if (!googleResponse.ok || googleUser.email_verified !== 'true' || !googleUser.sub || !googleUser.email) return res.status(401).json({ success: false, message: 'Unable to verify your Google account.' });
    if (process.env.GOOGLE_CLIENT_ID && googleUser.aud !== process.env.GOOGLE_CLIENT_ID) return res.status(401).json({ success: false, message: 'Google client configuration does not match.' });
    const email = googleUser.email.trim().toLowerCase();
    let user = await User.findOne({ $or: [{ googleSub: googleUser.sub }, { email }] });
    if (!user) user = new User({ email, googleSub: googleUser.sub });
    user.email = email;
    user.googleSub = googleUser.sub;
    if (req.body.adminKey && req.body.adminKey === adminKey()) user.role = 'admin';
    await user.save();
    res.json({ success: true, data: responseFor(user) });
  } catch (error) { next(error); }
};

module.exports = { googleLogin };