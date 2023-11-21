const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const validateToken = asyncHandler(async (req, res, next) => {
    let token;
    console.log("***** token is: ",token);
    let authHeader = req.headers.Authorization || req.headers.authorization;
    console.log("authHeader is: ******* ",authHeader);

    if (authHeader && authHeader.startsWith("Bearer")) {
        token = authHeader.split(" ")[1];
        console.log("***** token is: ",token);

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded)=>{
            if(err) {
                res.status(401);
                throw new Error("User is not Authorized !");
            }
            console.log("decoded is ********",decoded);
            req.user = decoded.user;
            next();
        });

        if (!token) {
            res.status(401);
            throw new Error("User is not Authorized or Token is missing in request !");
        }
    }
})


module.exports = validateToken;



