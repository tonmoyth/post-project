import { Router } from "express";
import { UserRoutes } from "../modules/User/user.route";


export const router = Router()

router.use("/auth", UserRoutes)