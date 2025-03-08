import express from "express";
import { UserController } from "../controllers/users.controller";

const router = express.Router();
const userController = new UserController();

router.get("/", userController.getAll.bind(userController));
router.get("/:id", userController.getById.bind(userController));
router.put("/:id", userController.UpdateById.bind(userController));

export default router;