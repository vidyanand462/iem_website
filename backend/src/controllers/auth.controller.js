import AuthService from '../services/auth.service.js';
import { sendSuccess } from '../utils/response.js';
import asyncHandler from '../utils/asyncHandler.js';
import { env } from '../config/env.js';

const attachAuthCookie = (res, token) => {
  const cookieOptions = {
    expires: new Date(Date.now() + env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'lax',
  };
  res.cookie('token', token, cookieOptions);
};

export class AuthController {
  static register = asyncHandler(async (req, res) => {
    const { email, password, first_name, last_name, phone } = req.body;
    const result = await AuthService.register({ email, password, first_name, last_name, phone });
    attachAuthCookie(res, result.token);
    return sendSuccess(res, result, 'Registration successful. Welcome to IEM Kolkata Admission Portal.', 201);
  });

  static login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const result = await AuthService.login({ email, password });
    attachAuthCookie(res, result.token);
    return sendSuccess(res, result, 'Login successful.');
  });

  static adminLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const result = await AuthService.adminLogin({ email, password });
    attachAuthCookie(res, result.token);
    return sendSuccess(res, result, 'Admin authenticated successfully.');
  });

  static logout = asyncHandler(async (req, res) => {
    res.cookie('token', 'loggedout', {
      expires: new Date(Date.now() + 5000),
      httpOnly: true,
    });
    return sendSuccess(res, null, 'Logged out successfully.');
  });

  static getMe = asyncHandler(async (req, res) => {
    const user = await AuthService.getCurrentUser(req.user.id);
    return sendSuccess(res, user, 'Profile retrieved successfully.');
  });

  static forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const result = await AuthService.requestPasswordReset(email);
    return sendSuccess(res, result, 'Password reset verification code generated.');
  });

  static resetPassword = asyncHandler(async (req, res) => {
    const { email, otp, new_password } = req.body;
    const result = await AuthService.resetPassword({ email, otp, new_password });
    return sendSuccess(res, result, 'Password has been reset successfully.');
  });
}

export default AuthController;
