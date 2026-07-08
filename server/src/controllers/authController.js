import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

function createToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

function sanitizeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // TEST TEMPORAIRE
  console.log("Email reçu :", email);
  console.log("Password reçu :", password);

  if (!email || !password) {
    res.status(400);
    throw new Error('Email et mot de passe requis.');
  }

  const user = await User.findOne({ email }).select('+password');

  // TEST TEMPORAIRE
  console.log("Utilisateur trouvé :", user);
  console.log("Password en base :", user?.password);

  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error('Identifiants incorrects.');
  }

  res.json({
    token: createToken(user._id),
    user: sanitizeUser(user),
  });
});

export const getMe = asyncHandler(async (req, res) => {
  res.json({ user: sanitizeUser(req.user) });
});
