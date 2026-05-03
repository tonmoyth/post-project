import { NextFunction, Request, Response } from 'express';
import { ZodObject, ZodError } from 'zod';
import { catchAsync } from '../shared/catchAsync';
import AppError from '../errors/error';


const validateRequest = (schema: ZodObject) => {
    return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
                cookies: req.cookies,
            });
            return next();
        } catch (error) {
            if (error instanceof ZodError) {
                const message = error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`).join(', ');
                throw new AppError(400, message);
            }
            throw error;
        }
    });
};

export default validateRequest;