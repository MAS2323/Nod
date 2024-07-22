const exprees = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const crypto = require("crypto");
const nodemiler = require("nodemailer");

//Creando una instancia para la app
const app = exprees();
const port = 3001;
const cors = require("cors");

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const jwt = require("jsonwebtoken");

mongoose
  .connect("mongodb+srv://masoneweernesto:test@cluster0.vvcjzw1.mongodb.net/AmazonApp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDb", err);
  });

app.listen(port, () => {
  console.log("Server is runnig on port 3001");
});

//endpoint to register in the app

const User = require("./models/user");
const Order = require("./models/order");

//function to send Verification Email to the user 3001/verify/${verificationToken}
const sendVerificationEmail = async (email, verificationToken) => {
  //create a nodemailer transport

  const transporter = nodemiler.createTransport({
    //Configure the email service
    service: "gmail",
    auth: {
      user: "masoneweernesto@gmail.com",
      pass: "pjei desk pbsq tanv",
    },
  });

  //compose the eamil message
  const mailOptions = {
    from: "onewemas2323@gmail.com",
    to: email,
    subject: "Email Verification",
    text: `Please click the following link to verify your email: http://192.168.0.121:3000/verify/${verificationToken}`,
  };

  //Send the email 
  try {
    await transporter.sendMail(mailOptions);
    
  } catch (error) {
    console.log('Error sending verification email', error)
    
  }
};

app.post("register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    //check if the user is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registred" });
    }

    //Create a new user
    const newUser = new User({ name, email, password });

    //generate and store the verification token
    newUser.verificationToken = crypto.randomBytes(20).toString("hex");

    //save the user to the database
    await newUser.save();

    //send verification email to the user
    sendVerificationEmail(newUser.email, newUser.verificationToken);
  } catch (error) {
    console.log("error registring user", error);
    res.status(500).json({ message: "Register failed" });
  }
});


//endpoint to verify the email 

app.get('/verify/:token', async(req, res) =>{
    try {
        const token = req.params.token;


        //Find the user with the given verification token 
        const user = await User.findOne({verificationToken: token});
        if(!user){
            return res.status(404).json({message: 'Invalid Verification token'})
        }

        //Mark the user as verified
        user.verified = true;
        user.verificationToken = undefined;

        await user.save();

        res.status(200).json({message: 'Email verified successfully'});
    } catch (error) {
        res.status(500).json({message: 'Email Verification Failed'})
    }
})