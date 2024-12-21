const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User");
const checkout = require("./models/checkout");
const bcrypt = require("bcrypt");
const cors = require("cors");

const mongouri = "mongodb://localhost:27017/user"; // MongoDB URI
const app = express();
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
// Connect to MongoDB
mongoose
  .connect(mongouri)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.error("Can't connect to MongoDB", error);
  });

// Routes

// Welcome route
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

  

    res.status(200).json({
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
});


// Get user by ID
app.get("/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete user by ID
app.delete("/user/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res
        .status(404)
        .json({ message: `Cannot find any user with ID ${req.params.id}` });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new user
app.post("/register", async (req, res) => {
  try {
    const userParam = req.body;

    // Check if username already exists
    const existingUser = await User.findOne({ username: userParam.username });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: `Username "${userParam.username}" already exists.` });
    }

    // Create a new user
    const newUser = new User({
      fullname: userParam.fullname,
      username: userParam.username,
      password: userParam.password,
    });

    await newUser.save();

    // Respond with success message
    return res.status(201).json({ message: "Registration successful!" });
  } catch (err) {
    console.error("Error during registration:", err.message);
    return res.status(500).json({ message: `Server error: ${err.message}` });
  }
});

// Update user by ID (optional, as needed)
app.put("/user/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
app.post("/checkout", async (req, res) => {
  try {
    const { creditname, creditnum ,date , cvv } = req.body;
    const expdate = dayjs(date);
   
    const nowdate = dayjs().startOf('month');
    console.log('Exp Date:', expdate.format('YYYY-MM'));
    console.log('Now Date:', nowdate.format('YYYY-MM'));
      if (expdate.isAfter(nowdate, 'month')) {
          const newcheckout = new checkout({ creditname,creditnum, creditnum, date: expdate.toDate(),cvv });
          await newcheckout.save();
          return res.status(200).send('Date is valid and saved.');
          } else {
              return res.status(400).send('Date is not valid.');
              }} catch (error) {
                console.error(error);
                 res.status(500).send('Server error.');
              }

})

app.delete('/checkout/:id', async (req, res) => { 
  try {
      const {id} = req.params;
      const dcheckout = await checkout.findByIdAndDelete(id);
      if(!dcheckout){
          return res.status(404).json({message: `cannot find any checkout with ID ${id}`})
      }
      return res.status(200).send('Checkout deleted successfully.');
      
  } catch (error) {
      res.status(500).json({message: error.message})
  }
});


app.listen(3001, () => console.log("App started on port 3001"));
