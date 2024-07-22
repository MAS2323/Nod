const express = require("express");
const app = express();
const mongoose = require("mongoose");
app.use(express.json());

const productRouter = require("./routers/products.routes");
// const userRouter = require("./routes/user");

const categoriesRouter = require("./routers/categories");

const userRouter = require('./routers/user')

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



app.use("/categories", categoriesRouter);


app.listen(process.env.PORT || port, () => {
  console.log(`Node js server started. ${process.env.PORT || port}!`);
});
