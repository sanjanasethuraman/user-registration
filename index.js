//import node_modules packages
import express from "express";
import bcrypt from "bcryptjs";
import jsonwebtoken from "jsonwebtoken";
import {} from "dotenv/config.js";

//import sub-directory modules
import {} from "./config/dbconnection.js"
import { User } from "./models/user.js";
//import register from "./routes/register.js";
import authentication from "./middleware/authentication.js" 
import { check } from "express-validator";

//Create express server to run API
const app = express();
app.use(express.json());
//const router = express.Router()

const { API_PORT } = process.env;
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

app.get('/', (req, res) => {
    res.send('We are in Home Page');
});

app.post("/register", async (req, res) => {
    try {
        const {first_name, last_name, email, phoneNumber, password, confirmPassword } = req.body;
        if (!(email && password && phoneNumber && first_name && last_name && confirmPassword)) {
            res.status(400).send("All inputs are required");
        }
        const oldUser = await User.findOne({ phoneNumber });

        if (oldUser) {
            return res.status(409).send("User already exists. Please login");
        }

        if (check(password).equals(confirmPassword)) {
            const encryptedPassword = await bcrypt.hash(password, 10);

            const user = await User.create({
                first_name,
                last_name,
                email: email.toLowerCase(),
                phoneNumber,
                password: encryptedPassword,
            });

            //Create token
            const token = jsonwebtoken.sign(
                { user_id: user._id, phoneNumber },
                process.env.TOKEN_KEY,
                {
                    expiresIn: "2h",
                }
            );
            console.log(token);

            //save user token
            user.token = token;

            //return new user
            res.status(201).json(user);
        }
    }    
    catch (err) {
        console.log(err)
    }
});

app.post("/login", async (req, res, next) => {
    try {
        const {phoneNumber, password } = req.body;

        if (!(phoneNumber && password)) {
            res.status(400).send("All inputs are required");
        }
        const user = await User.findOne({ phoneNumber });
        if (user && (await bcrypt.compare(password, user.password))) {
            //Create token
            const token = jsonwebtoken.sign(
                { user_id: user._id, phoneNumber },
                process.env.TOKEN_KEY,
                {
                    expiresIn: "2h",
                }
            );
            /* console.log(token);
            const verifycode = verify(token, "secret");
            console.log(verifycode); */
            user.token = token;

            //user
            res.status(200).json(user);
            if(res.status(200)) {
                console.log("Logged in")
            }
        }
        else {
            res.status(400).send("Invalid Credentials");
        }
    } catch (err) {
        console.log(err);
    }
    next();
});

app.get("/welcome", authentication, (req, res) => {
    res.status(200).send("Welcome 🙌");
    console.log(res.statusCode);
});