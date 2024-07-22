const express = require("express");
const router = express.Router();
const userController = require("../controllers/userControllers");

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/users/:userId", userController.getUsersExceptLoggedInUser);
router.post("/friend-request", userController.sendFriendRequest);
router.get("/friend-request/:userId", userController.getFriendRequests);
router.post("/friend-request/accept", userController.acceptFriendRequest);
router.get("/friends/:userId", userController.getFriends);
router.get("/:id", userController.getUser);
router.get("/:id", userController.deleteUser);
module.exports = router;
