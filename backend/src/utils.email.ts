import nodemailer from 'nodemailer'
import { User } from './models/user.model';

export const sendResetPasswordEmail = (user: User): void => {
  // Setup nodemailer transporter (update with your email provider details)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'Your Email Id',
      pass: 'Your Pass Key',
    },
  });

  // Send email with reset link
  const resetLink = `http://localhost:4200/reset-password?token=${user.resetPasswordToken}`;
  const mailOptions = {
    from: 'Your Email Id',
    to: user.email,
    subject: 'Password Reset',
    html: `<p>You are receiving this because you (or someone else) have requested the reset of the password for your account.</p>
          <p>Please click on the following link, or paste this into your browser to complete the process:</p>
          <p><a href="${resetLink}">${resetLink}</a></p>
          <p>Use this Reset token to change your password:<strong>"${user.resetPasswordToken}"</strong></p>
          <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending reset password email:', error);
    } else {
      console.log('Reset password email sent:', info.response);
    }
  });
};
