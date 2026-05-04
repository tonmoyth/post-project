import AppError from '../../errors/error';
import { auth } from '../../lib/auth';
import { tokenUtils } from '../../utils/token';


export const registerUser = async (payload: any) => {
    const { email, password, name } = payload;

    if (!email || !password || !name) {
        throw new AppError(400, 'Invalid input');
    }

    try {

        const userResponse = await auth.api.signUpEmail({
            body: { name, email, password }
        });

        if (!userResponse || !userResponse.user) {
            throw new AppError(400, 'Auth failure');
        }

        const user = userResponse.user;


        return user
    } catch (error: any) {
        console.log("error", error);
        if (error.message && error.message.includes('already exists')) {
            throw new AppError(409, 'Email already exists');
        }
        throw new AppError(400, 'Auth failure');
    }
};

export const loginUser = async (payload: any) => {
    const { email, password } = payload;

    if (!email || !password) {
        throw new AppError(400, 'Invalid input');
    }

    try {

        const userResponse = await auth.api.signInEmail({
            body: { email, password }
        });

        if (!userResponse || !userResponse.user) {
            throw new AppError(404, 'User not found');
        }

        const { user, token } = userResponse;

        const jwtPayload = {
            id: user.id,
            email: user.email,

        };

        const accessToken = tokenUtils.getToken(jwtPayload);
        const refreshToken = tokenUtils.getRefreshToken(jwtPayload);


        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            },
            accessToken,
            refreshToken,
            sessionToken: token
        };
    } catch (error: any) {
        throw new AppError(401, 'Invalid email/password');
    }
};

export const logoutUser = async (headers: any) => {
    if (!headers.authorization) return null;
    try {
        await auth.api.signOut({ headers });
    } catch (error) {
        console.log("logout error", error);
    }
    return null;
};

export const UserService = {
    registerUser,
    loginUser,
    logoutUser
};
