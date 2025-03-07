import express from "express";
import outfitsController from "../controllers/outfits.controller";

const router = express.Router();

router.get("/explore", outfitsController.explore);

export default router;