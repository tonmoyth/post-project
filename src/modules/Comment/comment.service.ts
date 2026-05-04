import { prisma } from '../../lib/prisma';
import AppError from '../../errors/error';

const createComment = async (payload: { content: string; postId: string; userId: string }) => {
    // 1. Check if post exists
    const post = await prisma.post.findUnique({
        where: { id: payload.postId }
    });

    if (!post) {
        throw new AppError(404, 'Post not found');
    }

    // 2. Create comment
    const newComment = await prisma.comment.create({
        data: {
            content: payload.content,
            userId: payload.userId,
            postId: payload.postId,
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                }
            }
        }
    });

    return newComment;
};

const updateComment = async (id: string, content: string, userId: string) => {
    // 1. Find comment
    const comment = await prisma.comment.findUnique({
        where: { id }
    });

    if (!comment) {
        throw new AppError(404, 'Comment not found');
    }

    // 2. Check ownership
    if (comment.userId !== userId) {
        throw new AppError(403, 'You are not authorized to update this comment');
    }

    // 3. Update comment
    const updated = await prisma.comment.update({
        where: { id },
        data: { content },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                }
            }
        }
    });

    return updated;
};

const deleteComment = async (id: string, userId: string) => {
    // 1. Find comment
    const comment = await prisma.comment.findUnique({
        where: { id }
    });

    if (!comment) {
        throw new AppError(404, 'Comment not found');
    }

    // 2. Check ownership
    if (comment.userId !== userId) {
        throw new AppError(403, 'You are not authorized to delete this comment');
    }

    // 3. Delete comment
    await prisma.comment.delete({
        where: { id }
    });

    return null;
};

export const CommentService = {
    createComment,
    updateComment,
    deleteComment
};
