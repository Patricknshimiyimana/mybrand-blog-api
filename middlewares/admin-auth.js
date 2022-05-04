const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if (!authHeader) {
        const error = new Error('Not authenticated!.')
        error.statusCode = 401;
        throw error
    }

    const token = authHeader.split(' ')[1];
    let decodedToken;

    try {
        decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Verify method decodes and verify the token
    } catch (err) {
        err.statusCode = 500;
        throw err
    }

    if (!decodedToken) {
        const error = new Error('Not authenticated!');
        error.statusCode = 401;
        throw error;
    }

    req.userId = decodedToken.userId;
    
    const adminId = "627292f5f87b635c52386f5e";

    if (req.userId !== adminId) {
        const error = new Error('Not authorized!');
        error.statusCode = 401;
        throw error;
    }
    next();
}

// module.exports = (req, res, next) => {
//   const authHeader = req.get('Authorization');
//     // const token = req.cookies.jwt;
//     const token = authHeader.split(' ')[1];
//     if (token) {
//       jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
//         if (err) {
//           return res.status(401).json({ message: "Not authorized" });
//         } else {
//           if (decodedToken.role !== "admin") {
//             return res.status(401).json({ message: "Not authorized..." });
//           } else {
//             req.role = decodedToken.role;
//             next();
//           }
//         }
//       });
//     } else {
//       return res
//         .status(401)
//         .json({ message: "Not authorized, token not available" });
//     }
//   };