const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const registerUser = asyncHandler(async (req,res)=>{
    const { username, email, password } = req.body;
    if(!username || !email || !password) {
        res.status(400);
        throw new Error("All fields are mandatory !");
    }
    const userAvailable = await User.findOne({ email });
    if(userAvailable) {
        res.status(400);
        throw new Error("User Already Registered");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("hashedPassword is: ",hashedPassword);

    const user = await User.create({
        username,
        email,
        password: hashedPassword
    })

    if(user) {
        console.log("created user is: ",user);
        res.status(201).json({ 
            message: "User Created Successfully",
            _id: user.id, 
            email: user.email 
        });
    }
    else {
        res.status(400);
        throw new Error("User Data is not Valid !");
    }

    res.json({message: "register user"});
});

const loginUser = asyncHandler(async (req,res)=>{
    const { email, password } = req.body;
    console.log("email & password is: ****** ", email, "   ", password);

    if (!email || !password) {
        res.status(400);
        throw new Error("All fields are mandatory !");
    }
    const user = await User.findOne({ email });
    console.log("**** fetched user is: ",user);

    if (user && (await bcrypt.compare(password, user.password))) {
        const accessToken = jwt.sign({
            user: {
                username: user.username,
                email: user.email,
                id: user.id
            }
        }, 
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "10m" }
        );
        res.status(200).json({ accessToken });
    }
    else {
        res.status(401).json("Invalid email/passowrd");
        throw new Error("email/password is Invalid");
    }
});

const currentUser = asyncHandler(async (req,res)=>{
    console.log("current user information");
    res.json({
        message: "current user information",
        data: req.user
    })
});

module.exports = { registerUser, loginUser, currentUser };
