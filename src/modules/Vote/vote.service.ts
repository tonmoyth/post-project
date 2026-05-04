import { prisma } from '../../lib/prisma';
import AppError from '../../errors/error';

const votePost = async (postId: string, userId: string, value: number) => {
    // 1. Check if post exists
    const post = await prisma.post.findUnique({
        where: { id: postId }
    });

    if (!post) {
        throw new AppError(404, 'Post not found');
    }

    // 2. Find existing vote
    const existingVote = await prisma.vote.findUnique({
        where: {
            userId_postId: {
                userId,
                postId,
            }
        }
    });

    // 3. Handle voting logic
    if (existingVote) {
        if (existingVote.value === value) {
            // Same vote clicked again -> Remove vote (Toggle)
            await prisma.vote.delete({
                where: {
                    userId_postId: {
                        userId,
                        postId,
                    }
                }
            });
        } else {
            // Different vote clicked -> Update vote value
            await prisma.vote.update({
                where: {
                    userId_postId: {
                        userId,
                        postId,
                    }
                },
                data: { value }
            });
        }
    } else {
        // No existing vote -> Create new vote
        await prisma.vote.create({
            data: {
                userId,
                postId,
                value
            }
        });
    }

    // 4. Aggregate counts
    const likes = await prisma.vote.count({
        where: { postId, value: 1 }
    });

    const dislikes = await prisma.vote.count({
        where: { postId, value: -1 }
    });

    // 5. Get current user's vote state
    const currentUserVote = await prisma.vote.findUnique({
        where: {
            userId_postId: {
                userId,
                postId,
            }
        }
    });

    return {
        userVote: currentUserVote ? currentUserVote.value : 0,
        likes,
        dislikes
    };
};

export const VoteService = {
    votePost
};
