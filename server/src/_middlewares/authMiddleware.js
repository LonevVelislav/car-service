const jwt = require("jsonwebtoken");
const Admin = require("../_models/Admin");

const { promisify } = require("util");
const { extractErrorMsg } = require("../utils/errorHandler");

exports.protect = async (req, res, next) => {
    let token;

    try {
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            throw new Error("your not logged in! please log in to get access");
        }
        const decoded = await promisify(jwt.verify)(token, process.env.SECRET);
        const currentAdmin = await Admin.findById(decoded.id);

        if (!currentAdmin) {
            throw new Error("the user belonging to the token does no longer exists");
        }

        req.admin = currentAdmin;
        console.log(req.admin);

        next();
    } catch (err) {
        res.status(401).json({
            status: "fail",
            message: extractErrorMsg(err),
        });
    }
};
