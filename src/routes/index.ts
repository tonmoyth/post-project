import { Router } from "express";
import { UserRoutes } from "../modules/User/user.route";
import { PostRoutes } from "../modules/Post/post.route";
import { VoteRoutes } from "../modules/Vote/vote.route";

export const router = Router()

router.use("/auth", UserRoutes)
router.use("/posts", PostRoutes)
router.use("/votes", VoteRoutes)