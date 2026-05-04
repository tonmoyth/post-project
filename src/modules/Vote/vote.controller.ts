import { Request, Response } from 'express';
import { catchAsync } from '../../shared/catchAsync';
import { VoteService } from './vote.service';
import sendResponse from '../../utils/sendResponse';

export const votePost = catchAsync(async (req: Request, res: Response) => {
    const { postId } = req.params;
    const userId = req.user.id;
    const { value } = req.body;

    const result = await VoteService.votePost(postId as string, userId, value);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Vote updated successfully',
        data: result,
    });
});

export const VoteController = {
    votePost
};
