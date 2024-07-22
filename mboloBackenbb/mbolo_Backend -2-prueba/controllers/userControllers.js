const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

module.exports = {
  createToken: (userId) => {
    const payload = { userId };
    const token = jwt.sign(payload, process.env.JWT_SEC, { expiresIn: "1h" });
    return token;
  },

  registerUser: async (req, res) => {
    try {
      const { userName, email, password, image, location, mobile } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        userName,
        email,
        password: hashedPassword,
        image,
        location,
        mobile,
      });
      await newUser.save();
      res.status(200).json({ message: "User registered successfully" });
    } catch (error) {
      console.error("Error registering user", error);
      res.status(500).json({ message: "Error registering the user!" });
    }
  },

  loginUser: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res
          .status(401)
          .json({ message: "Introduzca los datos correctos" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Clave incorrecta" });
      }

      const userToken = jwt.sign({ id: user._id }, process.env.JWT_SEC, {
        expiresIn: "7d",
      });
      const { password: _, __v, createdAt, updatedAt, ...userData } = user._doc;

      res.status(200).json({ ...userData, token: userToken });
    } catch (error) {
      console.error("Error in loginUser:", error);
      res.status(500).json({ message: "Error al iniciar sesión" });
    }
  },

  getUsersExceptLoggedInUser: async (req, res) => {
    try {
      const loggedInUserId = req.params.userId;
      if (!loggedInUserId) {
        return res.status(400).json({ message: "User ID is required" });
      }
      const users = await User.find({ _id: { $ne: loggedInUserId } });
      res.status(200).json(users);
    } catch (error) {
      console.error("Error retrieving users", error);
      res.status(500).json({ message: "Error retrieving users" });
    }
  },

  sendFriendRequest: async (req, res) => {
    try {
      const { currentUserId, selectedUserId } = req.body;
      await User.findByIdAndUpdate(selectedUserId, {
        $push: { friendRequests: currentUserId },
      });
      await User.findByIdAndUpdate(currentUserId, {
        $push: { sentFriendRequests: selectedUserId },
      });
      res.sendStatus(200);
    } catch (error) {
      console.error("Error sending friend request", error);
      res.sendStatus(500);
    }
  },

  getFriendRequests: async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await User.findById(userId)
        .populate("friendRequests", "name email image")
        .lean();
      res.status(200).json(user.friendRequests);
    } catch (error) {
      console.error("Error retrieving friend requests", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  acceptFriendRequest: async (req, res) => {
    try {
      const { senderId, recipientId } = req.body;
      const sender = await User.findById(senderId);
      const recipient = await User.findById(recipientId);
      sender.friends.push(recipientId);
      recipient.friends.push(senderId);
      recipient.friendRequests = recipient.friendRequests.filter(
        (request) => request.toString() !== senderId.toString()
      );
      sender.sentFriendRequests = sender.sentFriendRequests.filter(
        (request) => request.toString() !== recipientId.toString()
      );
      await sender.save();
      await recipient.save();
      res.status(200).json({ message: "Friend Request accepted successfully" });
    } catch (error) {
      console.error("Error accepting friend request", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  getFriends: async (req, res) => {
    try {
      const userId = req.params.userId;
      const user = await User.findById(userId).populate(
        "friends",
        "name email image"
      );
      const friendIds = user.friends.map((friend) => friend._id);
      res.status(200).json(friendIds);
    } catch (error) {
      console.error("Error retrieving friends", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  },

  getUser: async (req, res) => {
  try {
    // Validar que el ID proporcionado es válido
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID de usuario no válido" });
    }

    // Buscar el usuario por ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Excluir campos no deseados
    const { password, __v, createdAt, updatedAt, image, ...userData } = user._doc;

    // Responder con los datos del usuario
    res.status(200).json(userData);
  } catch (error) {
    console.error("Error retrieving user", error);
    res.status(500).json({ message: "Error al recuperar el usuario" });
  }
},

  deleteUser: async (req, res) => {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("Usuario Eliminado");
    } catch (error) {
      console.error("Error deleting user", error);
      res.status(500).json(error);
    }
  },
};
