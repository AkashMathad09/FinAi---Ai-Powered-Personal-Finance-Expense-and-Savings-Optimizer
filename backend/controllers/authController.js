const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Wallet = require('../models/Wallet'); 

// Helper function to generate a JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register a new user
exports.registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Please include all fields' });
    }

    try {
        // 1. Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // 2. Generate Unique UPI ID
        // Format: cleanusername + 4 random numbers + @finai
        const randomNum = Math.floor(1000 + Math.random() * 9000);
        const cleanName = username.toLowerCase().replace(/[^a-z0-9]/g, '');
        const generatedUpi = `${cleanName}${randomNum}@finai`;

        // 3. Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Create User (With the new UPI ID)
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            upiId: generatedUpi // Save UPI in User model for easy lookup
        });

        if (user) {
            // 5. Create Wallet for the new user
            try {
                await Wallet.create({
                    userId: user._id, // Link wallet to user
                    balance: 0        // Initialize with 0 balance
                });
            } catch (walletError) {
                // If wallet creation fails, delete the user to prevent issues
                await User.findByIdAndDelete(user._id);
                console.error('Wallet creation failed:', walletError);
                return res.status(500).json({ message: 'Registration failed: Could not create wallet.' });
            }

            // 6. Send Success Response
            res.status(201).json({
               user:{
                _id: user.id,
                username: user.username,
                email: user.email,
                upiId: user.upiId  // Send this back so frontend can display it
                },
                token: generateToken(user._id),
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: `Server Error: ${error.message}` });
    }
};

// @desc    Login a user
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            res.json({
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    upiId: user.upiId // Include UPI ID in login response
                },
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: `Server Error: ${error.message}` });
    }
};