const express = require("express");
const app = express();
const mongoose = require("mongoose");
app.use(express.json());
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const productRouter = require("./routes/products.routes");
const userRouter = require("./routes/user");
const cartRouter = require("./routes/cart");
const orderRouter = require("./routes/orderRoutes");
const categoriesRouter = require("./routes/categories");
const paymentMethodsRouter = require("./routes/paymentMethodsRouter");


// const categoryRoutes = require("./routes/categories");

const favoritesRoutes = require("./routes/favoritesRoutes");
const messageRoutes = require("./routes/messageRoutes");
const orderRoutes = require("./routes/orderRoutes");
const subcategoriesRouter = require("./routes/subcategories");
// const authMiddleware = require("./middleware/authenticateToken");
const dotenv = require("dotenv");
const port = 3000;

dotenv.config();
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Base de Datos conectada"))
  .catch((err) => console.log(err));

// app.get('/', (req, res) => res.send('Furniture Word'))

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use("/products", productRouter);
app.use("/", userRouter);
app.use("/cart", cartRouter);
app.use("/orders", orderRouter);

app.use("/payment-methods", paymentMethodsRouter);
app.use("/favorites", favoritesRoutes);
app.use("/messages", messageRoutes);
app.use("/orders", orderRoutes);
app.use("/subcategories", subcategoriesRouter);
app.use("/categories", categoriesRouter);

// app.use("/secure-route", authMiddleware);


app.listen(process.env.PORT || port, () => {
  console.log(`Node js server started. ${process.env.PORT || port}!`);
});
