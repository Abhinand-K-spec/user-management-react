import User from "../models/users.js";
import multer from "multer";
import jwt from "jsonwebtoken";


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`);
    }
  });
  export const upload = multer({ storage: storage });


export const register = async (req, res) => {
  const { name, lastname, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ error: 'Email already exists' });
    }

    const user = new User({ name, lastname, email, password });
    await user.save();
    res.status(201).send({ message: 'User registered', user });
  } catch (error) {
    res.status(500).send({ error: 'Server error' });
  }
};
  export const login = async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email, password });
      console.log(user);
  
      if (!user) {
        return res.status(401).send({ message: "Invalid credentials" });
      }
  
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "30m"
      });
   
      res.status(200).send({
        message: "Login successful",
        token,
        user
      });
  
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Server error" });
    }
  };


  export const home = (req, res) => {
    res.send("Welcome to the user home page!");
  };
  
  export const uploadProfile = async (req, res) => {
    try {
      const userId = req.user.id; 
  
      const user = await User.findByIdAndUpdate(
        userId, 
        { profileImage: req.file.filename },
        { new: true }
      );
  
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }
  
      res.send({ message: "Profile image updated", user });
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Server error" });
    }
  };