import express from "express";
import { AddUser, DeleteUser, FindUser, GetUsers, UpdateUser, userLogin, verifyOtp } from "../Controller/userController.js";
import { CreateNewImage } from "../Controller/imagecontroller.js";
import { imageUpload } from "../lib/multer.js";
import { authMiddleware } from "../middleware/Authorization.js";

const router = express.Router();
router
  .route("/user")
  .post(imageUpload.single("profile"), AddUser)
  .put(imageUpload.single("profile"), UpdateUser)
  .get(GetUsers)
  .delete(DeleteUser)
  

// EXTRA IMAGE TEST ROUTE
router.post(
  "/image",
  imageUpload.single("profile"),
  CreateNewImage
);

router.post("/login", userLogin);
router.put("/verify", verifyOtp);
router.get("/me",authMiddleware,FindUser)

export default router;