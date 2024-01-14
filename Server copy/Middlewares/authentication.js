const JWT = require("../Helpers/Jsonwebtoken");
function authentication(req, res, next) {
    const { jwt } = req.headers;
    try {
        const userData = JWT.verify(jwt);
        req.userData = userData;
        next();
    } catch (error) {
        next(error);
    }
}

module.exports = authentication;
