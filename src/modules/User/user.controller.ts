// modules/user/user.controller.ts
import { Request, Response } from 'express';
import { catchAsync } from '../../shared/catchAsync';
import { UserService } from './user.service';
import { tokenUtils } from '../../utils/token';
import { cookieUtil } from '../../utils/cookie';

export const registerUser = catchAsync(async (req: Request, res: Response) => {

    const result = await UserService.registerUser(req.body);

    res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: result,
    });
});

export const loginUser = catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.loginUser(req.body);

    const { user, accessToken, refreshToken, sessionToken } = result;

    tokenUtils.setTokenCookie(res, accessToken);
    tokenUtils.setRefreshTokenCookie(res, refreshToken);
    tokenUtils.setBetterAuthSession(res, sessionToken);

    res.status(200).json({
        success: true,
        message: 'User logged in successfully',
        data: user,
        token: result.accessToken,
        refreshToken: result.refreshToken,
        sessionToken: result.sessionToken
    });
});

export const logoutUser = catchAsync(async (req: Request, res: Response) => {
    // const sessionToken = req.cookies['better-auth.session_token'];

    await UserService.logoutUser(req.headers);

    cookieUtil.clearCookie(res, 'accessToken', { path: '/' });
    cookieUtil.clearCookie(res, 'refreshToken', { path: '/' });
    cookieUtil.clearCookie(res, 'better-auth.session_token', { path: '/' });

    res.status(200).json({
        success: true,
        message: 'User logged out successfully',
        data: null
    });
});
