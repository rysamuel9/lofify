import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';

// a user makes a request to /api/signup
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const salt = bcrypt.genSaltSync();
  const { email, password } = req.body;

  let user;

  // attempt to make a user with Prisma with the email and a hashed password
  try {
    user = await prisma.user.create({
      data: {
        email,
        password: bcrypt.hashSync(password, salt),
      },
    });
  } catch (e) {
    res.status(401).json({
      error: 'User already exists',
    });
  }

  // if succeeds, create a JSON web token with the email
  const token = jwt.sign(
    {
      email: user.email,
      id: user.id,
      time: Date.now(),
    },
    'hello',
    { expiresIn: '8h' }
  );

  // then take that token and serialize it in a cookie called LOFIFY_ACCESS_TOKEN
  // give properties its only accessible at HTTP. it also expires in 8h
  res.setHeader(
    'Set-Cookie',
    cookie.serialize('LOFIFY_ACCESS_TOKEN', token, {
      httpOnly: true,
      maxAge: 8 * 60 * 60,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    })
  );

  // and then send back that user object that we got from the database
  res.json(user);
};
