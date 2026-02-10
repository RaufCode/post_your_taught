import { Router } from "express";
import { getUsers } from "../controllers/user.controller.mts";

const router = Router();

router.get("/", getUsers);




export default router;