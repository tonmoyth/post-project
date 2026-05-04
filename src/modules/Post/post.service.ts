import { prisma } from '../../lib/prisma';
import AppError from '../../errors/error';
import { IQueryParams } from '../../interface/queryBuilder.interface';
import { QueryBuilder } from '../../utils/quearyBuilder';

const createPost = async (payload: any, authorId: string) => {
    // Validate author exists
    const author = await prisma.user.findUnique({
        where: { id: authorId }
    });

    if (!author) {
        throw new AppError(404, 'Author not found');
    }

    const postData = {
        title: payload.title,
        description: payload.description,
        url: payload.url || null,
        authorId: authorId,
    };

    const newPost = await prisma.post.create({
        data: postData,
    });

    return newPost;
};

const getAllPosts = async (query: IQueryParams) => {
    const postQuery = new QueryBuilder(prisma.post as any, query, {
        searchableFields: ['title', 'description'],
        filterableFields: ['authorId'],
    })
        .search()
        .filter()
        .sort()
        .paginate()
        .include({
            author: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                }
            },
            _count: {
                select: { 
                    votes: true,
                    comments: true
                }
            },
            comments: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            image: true,
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                },
                take: 5 // Optional: limiting comments in list view
            }
        });

    const result = await postQuery.execute();
    return result;
};

const getSinglePost = async (id: string) => {
    const post = await prisma.post.findUnique({
        where: { id },
        include: {
            author: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                }
            },
            votes: true,
            _count: {
                select: { 
                    votes: true,
                    comments: true
                }
            },
            comments: {
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            image: true,
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            }
        }
    });

    if (!post) {
        throw new AppError(404, 'Post not found');
    }

    return post;
};

const updatePost = async (id: string, payload: any, userId: string) => {
    const post = await prisma.post.findUnique({
        where: { id }
    });

    if (!post) {
        throw new AppError(404, 'Post not found');
    }

    // Only owner or admin can update
    if (post.authorId !== userId) {
        throw new AppError(403, 'You are not authorized to update this post');
    }

    const result = await prisma.post.update({
        where: { id },
        data: payload,
    });

    return result;
};

const deletePost = async (id: string, userId: string, isAdmin: boolean) => {
    const post = await prisma.post.findUnique({
        where: { id }
    });

    if (!post) {
        throw new AppError(404, 'Post not found');
    }

    // Only owner or admin can delete
    if (post.authorId !== userId && !isAdmin) {
        throw new AppError(403, 'You are not authorized to delete this post');
    }

    await prisma.post.delete({
        where: { id }
    });

    return null;
};

export const PostService = {
    createPost,
    getAllPosts,
    getSinglePost,
    updatePost,
    deletePost
};
