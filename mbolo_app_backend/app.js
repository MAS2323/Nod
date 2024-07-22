const express = require('express');
const app = express();
app.use(express.json());
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const mongoUrl =
  "mongodb+srv://masoneweernesto:test@cluster0.vvcjzw1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const JWT_SECRET = "hvdvay6ert72839289()aiyg8t87qt72393293883uhefiuh78ttq3ifi78272jdsds039[]]pou89ywe";
  mongoose.connect(mongoUrl).then(() =>{
    console.log('Database connected'); 
  }).catch((e) => {
    console.log(e);
  });

require('./UserDetails');  

const User = mongoose.model('UserInfo');
//Apis

app.get('/', (req, res)=>{

    res.send({status: 'Started'})

});

//Api del registro
app.post('/register', async(req, res) =>{
    const { name, email, mobile, password, userType} = req.body;
    console.log(req.body);
    const oldUser = await User.findOne({email:email});

    if(oldUser){
        return res.send({data: 'Usuario existente!'});
    }
    const encryptedPassword = await bcrypt.hash(password, 10)
    try {
        await User.create({
          name: name,
          email: email,
          mobile,
          password: encryptedPassword,
          userType,
        });
        res.send({status: 'Ok', data: 'User Created'})
    } catch (error) {
        res.send({ status: "error", data: error });
    }
});

//Api del Login
app.post("/login-user", async (req, res) => {
  const { email, password } = req.body;
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

//Get users
app.post('/userdata', async(req, res)=> {
  const {token} = req.body;
  try {
    const user = jwt.verify(token, JWT_SECRET)
    const useremail = user.email;

    User.findOne({email: useremail}).then(data => {
      return res.send({status: 'ok', data: data})
    })
  } catch (error) {
    return res.send({error: error})
  }
});


app.listen(3000, () => {
    console.log('Node js server started');
})

//Actualizar los datos de un usuario 
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