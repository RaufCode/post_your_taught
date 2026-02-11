import { Router } from "express";
import { loginUser,getUsers, createUser, getUserById, updateUser, deleteUser,refreshToken } from "../controllers/user.controller.mts";

const router = Router();


router.post("/login", loginUser)
router.get("/", getUsers);
router.post("/", createUser);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.post("/refresh-token", refreshToken);




export default router;