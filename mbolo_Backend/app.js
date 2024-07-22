const express = require("express");
const app = express();
const mongoose = require("mongoose");
app.use(express.json());
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Category = require('./category/categorySchema');
const productRouter = require('./routes/products.routes');

  const mongoUrl =
    "mongodb+srv://masoneweernesto:test@cluster0.vvcjzw1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

  const JWT_SECRET =
    "hvdvay6ert72839289()aiyg8t87qt72393293883uhefiuh78ttq3ifi78272jdsds039[]]pou89ywe";
  mongoose
    .connect(mongoUrl)
    .then(() => {
      console.log("Database Connected");
    })
    .catch((e) => {
      console.log(e);
    });

  //Importando nuestro esquema 
require("./UserDetails");
require('./category/postModel');
const User = mongoose.model("UserInfo");

app.get("/", (req, res) => {
  res.send({ status: "Started" });
});


//Codigo para los post 
app.post("/postsub", async (req, res) => {
  const { title, desc, category, address, price, image } = req.body;
  console.log(req.body);

 
  try {
    await User.create({
      title: title,
      desc,
      category,
      address,
      price,
      image,
    });
    res.send({
      status: "ok",
      data: "User Created",
    });
  } catch (error) {
    res.send({ status: "error", data: error });
  }
});

//cargar todos los post
app.get("/postsub", async (req, res) => {
  try {
    const postsubd = await Postsub.find();
    res.json(postsubd);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});





// Ruta para crear una nueva categoría
app.post('/categories', async (req, res) => {
  const { name } = req.body;

  try {
    const newPostsub = new Postsub({ name });
    await newPostsub.save();
    res.status(201).json(newPostsub);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// // Crear una nueva categoría
// app.post("/categorias", async (req, res) => {
//   const category = new Category({
//     name: req.body.name,
//   });

//   try {
//     const newCategory = await category.save();
//     res.status(201).json(newCategory);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });


// Ruta para obtener todas las categorías
app.get('/all-category', async (req, res) => {
  try {
    const categories = await Category.find();
    const formattedCategories = categories.map(category => ({
      label: category.name,
      value: category._id.toString(), // Convertir ObjectId a string
    }));
    res.json(formattedCategories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Más rutas para actualizar y eliminar categorías según sea necesario



//Api del registro
app.post("/register", async (req, res) => {
  const { name, email, mobile, password, userType } = req.body;
  console.log(req.body);

  const oldUser = await User.findOne({ email: email });

  if (oldUser) {
    return res.send({ data: "User already exists!!" });
  }
  const encryptedPassword = await bcrypt.hash(password, 10);

  try {
    await User.create({
      name: name,
      email: email,
      mobile,
      password: encryptedPassword,
      userType,
    });
    res.send({ 
      status: "ok", 
      data: "User Created" 
    });
  } catch (error) {
    res.send({ status: "error", data: error });
  }
});


//Api del Login
app.post("/login-user", async (req, res) => {
  const { email, password } = req.body; //Esta informacion la cogemos de lo que introduce el usuario de nuestra app 
  console.log(req.body);
  const oldUser = await User.findOne({ email: email });

  if (!oldUser) {
    return res.send({ data: "User doesn't exists!!" });
  }

  if (await bcrypt.compare(password, oldUser.password)) {
    const token = jwt.sign({ email: oldUser.email }, JWT_SECRET);
    console.log(token);
    if (res.status(201)) {
      return res.send({
        status: "ok",
        data: token,
        userType: oldUser.userType,
      });
    } else {
      return res.send({ error: "error" });
    }
  }
});

//Api Get Users

app.post("/userdata", async (req, res) => {
  const { token } = req.body; 
  try {
    const user = jwt.verify(token, JWT_SECRET);
    const useremail = user.email;

    User.findOne({ email: useremail }).then((data) => {
      return res.send({ status: "Ok", data: data });
    }); 
  } catch (error) {
    return res.send({ error: error });
  }
});

//Api update User
app.post("/update-user", async (req, res) => {
  const { name, email, mobile, image, gender, profession } = req.body;
  console.log(req.body);
  try {
    await User.updateOne(
      { email: email },
      {
        $set: {
          name,
          mobile,
          image,
          gender,
          profession,
        },
      }
    );
    res.send({ status: "Ok", data: "Updated" });
  } catch (error) {
    return res.send({ error: error });
  }
});

//Api get all user 
app.get("/get-all-user", async (req, res) => {
  try {
    const data = await User.find({});
    res.send({ status: "Ok", data: data });
  } catch (error) {
    return res.send({ error: error });
  }
});

//Api delete user 
app.post("/delete-user",async (req, res) => {
 const {id}=req.body;
 try {
  await User.deleteOne({_id:id});
  res.send({status:"Ok",data:"User Deleted"});
 } catch (error) {
  return res.send({ error: error });
  
 }
})


app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({ limit: "10mb", extended: true}));

app.use('/products', productRouter);

app.listen(3000, () => {
  console.log("Node js server started.");
});
