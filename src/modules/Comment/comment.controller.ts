import { Request, Response } from 'express';
import { catchAsync } from '../../shared/catchAsync';
import { CommentService } from './comment.service';
import sendResponse from '../../utils/sendResponse';

export const createComment = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user.id;
    const { postId, content } = req.body;

    const result = await CommentService.createComment({
        postId,
        content,
        userId
    });

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Comment created successfully',
        data: result,
    });
});

export const updateComment = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user.id;
    const { content } = req.body;

    const result = await CommentService.updateComment(id as string, content, userId);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Comment updated successfully',
        data: result,
    });
});

export const deleteComment = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user.id;

    await CommentService.deleteComment(id as string, userId);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Comment deleted successfully',
        data: null,
    });
});

export const CommentController = {
    createComment,
    updateComment,
    deleteComment
};
