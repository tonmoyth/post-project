import { Request, Response } from 'express';
import { catchAsync } from '../../shared/catchAsync';
import { PostService } from './post.service';
import sendResponse from '../../utils/sendResponse';

export const createPost = catchAsync(async (req: Request, res: Response) => {
    const authorId = req.user.id;

    const result = await PostService.createPost(req.body, authorId);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Post created successfully',
        data: result,
    });
});

export const getAllPosts = catchAsync(async (req: Request, res: Response) => {
    const result = await PostService.getAllPosts(req.query as any);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Posts fetched successfully',
        meta: result.meta,
        data: result.data,
    });
});

export const getSinglePost = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await PostService.getSinglePost(id as string);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Post fetched successfully',
        data: result,
    });
});

export const updatePost = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user.id;


    // If there's a cloudinary URL, use it
    if (req.body.url) {
        // Already set by uploadToCloudinary middleware
    }

    const result = await PostService.updatePost(id as string, req.body, userId);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Post updated successfully',
        data: result,
    });
});

export const deletePost = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'ADMIN';

    await PostService.deletePost(id as string, userId, isAdmin);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Post deleted successfully',
        data: null,
    });
});

export const PostController = {
    createPost,
    getAllPosts,
    getSinglePost,
    updatePost,
    deletePost
};
