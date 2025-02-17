


const express = require('express');
const app = express();
const mongoose = require('mongoose');
const {User} = require('./models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const morgan = require('morgan');


mongoose.connect('mongodb://127.0.0.1:27017/ecommerceKle')
.then(()=>{
    console.log("DB is connected");
}).catch(()=>{
    console.log("DB is not connected")
})

app.use(cors());
app.use(morgan("dev"));
//for form method we use middleware 
app.use(express.json())

//task-1 -> route for register
app.post('/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;

        // Check if any field is missing
        if (!email || !password || !name) {
            return res.status(400).json({ message: "Some fields are missing" });
        }

        // Check if the user already exists
        const isUserAlreadyExist = await User.findOne({ email });

        if (isUserAlreadyExist) {
            return res.status(400).json({ message: "User already has an account" });
        }

        // Hash the password
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        // Generate JWT token
        const token = jwt.sign({ email }, "supersecret", { expiresIn: "1h" });

        // Create user in database
        await User.create({
            name,
            email,
            password: hashedPassword,
            token
        });

        return res.status(201).json({ message: "User created successfully" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});

//task 2 ->route for login
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if email or password is missing
        if (!email || !password) {
            return res.status(400).json({ message: "Email and Password are required" });
        }

        // Find user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "User is not registered. Please register first." });
        }

        //  Compare the entered password with the stored hashed password
        const isPasswordMatched = bcrypt.compareSync(password, user.password);

        if (!isPasswordMatched) {
            return res.status(400).json({ message: "Password not matched" });
        }

        //  Successful login - Return user data
        return res.status(200).json({
            name: user.name,
            email: user.email,
            token: user.token
        });

    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});



let PORT = 8080;
app.listen(PORT,()=>{
    console.log(`server is connected to ${PORT}`);
})