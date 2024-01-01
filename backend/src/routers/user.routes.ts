import express, { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { User, UserModel, UserType } from '../models/user.model';
import bcrypt from 'bcryptjs';
import { generateToken, isAdmin, isAuth } from '../utils';
import crypto from "crypto";
import { sendResetPasswordEmail } from '../utils.email';
export const userRouter = express.Router();

userRouter.post(
  '/login',
  asyncHandler(async (req: Request, res: Response) => {
    const user = await UserModel.findOne({ email: req.body.email });
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        return res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user),
        });
      }
    }
    res.status(401).send({ message: 'Invalid email or password' });
  })
);

userRouter.post(
  '/register',
  asyncHandler(async (req: Request, res: Response) => {
    const user = await UserModel.create({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password),
    
    } as User);

    res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user),
    });
  })
);

userRouter.get(
  '/:id',
  asyncHandler(async (req: Request, res: Response) => {
    const user = await UserModel.findById(req.params.id);
    if (user) {
      res.send(user);
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  })
);
userRouter.put(
  '/update-profile',
  isAuth,
  asyncHandler(async (req: Request, res: Response) => {
    const user = await UserModel.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;

      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password, 8);
      }
      const updatedUser = await user.save();
      res.send({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: generateToken(updatedUser),
      });
    }
  })
);

userRouter.get(
  '/',
  isAuth,
  isAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const users = await UserModel.find({});
    res.send(users);
  })
);

userRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const user = await UserModel.findById(req.params.id);
    if (user) {
      if (user.email === 'admin@example.com') {
        res.status(400).send({ message: 'Can Not Delete Admin User' });
        return;
      }
      const deleteUser = await user.remove();
      res.send({ message: 'User Deleted', user: deleteUser });
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  })
);

userRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    const user = await UserModel.findById(req.params.id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.isAdmin = Boolean(req.body.isAdmin);
      // user.isAdmin = req.body.isAdmin || user.isAdmin;
      const updatedUser = await user.save();
      res.send({ message: 'User Updated', user: updatedUser });
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  })
);
userRouter.post(
  '/forgot-password',
  asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;

    try {
      // Find the user by email
      const user = await UserModel.findOne({ email });

      if (user) {
        // Generate reset token and set expiration time
        const resetPasswordToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = resetPasswordToken;
        user.resetPasswordExpires = new Date(Date.now() + 3600000); // Token expires in 1 hour
        await user.save();

        // Send reset password email
        sendResetPasswordEmail(user);

        res.status(200).json({ message: 'Reset password email sent successfully' });
      } else {
        // User not found
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  })
);

userRouter.post('/reset-password', asyncHandler(async (req: Request, res: Response) => {
  const { email, resetPasswordToken, password } = req.body;

  try {
    console.log('Reset Password Request Body:', req.body);

    const user = await UserModel.findOne({
      email,
      resetPasswordToken,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (user) {
      console.log('User before password reset:', user);

      // Ensure newPassword is defined and not an empty string
      if (password === undefined || typeof password !== 'string' || password.trim() === '') {
        return res.status(400).json({ message: 'Invalid new password' });
      }

      // Update user's password and clear the reset token
      user.password = bcrypt.hashSync(password, 5);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;

      const resetpassword=await user.save();

      console.log('User after password reset:', user);

      res.status(200).json({ message: 'Password reset successfully!..... please go to login', user:resetpassword });
    } else {
      res.status(400).json({ message: 'Invalid or expired token' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' || 'An error occurred' });
  }
}));
