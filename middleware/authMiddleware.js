const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // 1. Get token from the header
    const token = req.header('x-auth-token');

    // 2. Check if token doesn't exist
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // 3. If token exists, verify it
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 4. Add the user payload from the token to the request object
        req.user = decoded.user;

        // 5. Call the next middleware or controller
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};