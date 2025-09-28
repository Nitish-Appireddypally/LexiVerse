// const jwt = require('jsonwebtoken');
// const protect =(req,res,next)=>{
//     const authHeader = req.headers.authorization;
//     if(!authHeader || !authHeader.startsWith('Bearer '))
//         return res.status(401).json({message: 'No token provided'});

//     const token=authHeader.split(' ')[1];
//     try{
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user=decoded;
//         next();

//     }
//     catch(err){
//         return res.status(401).json({message: 'Token invalid or expired'});
//     }
// };
// module.exports={protect};

const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// This function generates a middleware that checks for specific roles
const authorize = (allowedRoles) => {
  return async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not authorized, no token provided' });
    }

    const token = authHeader.split(' ')[1];

    try {
      // 1. Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 2. Fetch the user from the database
      const currentUser = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, email: true, name: true, role: true },
      });

      if (!currentUser) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      // 3. Attach user to the request
      req.user = currentUser;

      // 4. Check if the user's role is in the list of allowed roles
      if (allowedRoles && allowedRoles.length > 0) {
        if (!allowedRoles.includes(currentUser.role)) {
          return res.status(403).json({ message: 'Forbidden: You do not have permission to perform this action.' });
        }
      }

      next(); // User is authenticated and authorized
    } catch (err) {
      return res.status(401).json({ message: 'Not authorized, token is invalid or expired' });
    }
  };
};

module.exports = { authorize };