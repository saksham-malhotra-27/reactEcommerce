import { Router } from "express";
import { isSignedIn } from "../middlewares/auth.js";
import { save3d } from "../controllers/3dcontroller.js";

const router = Router();

router.post('/save3d', isSignedIn, save3d);

export default router 