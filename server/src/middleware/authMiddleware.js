import jwt from "jsonwebtoken";

export const protect = (req,res,next)=>{
    try{
    // Check authorization header

        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success : false,
                message: "Authentication required. Please login.",

            });
            
        }

        //Verify jwt token 
      const token = authHeader.split(" ")[1];

const decoded = jwt.verify(
  token,
  process.env.JWT_SECRET
);
        //ATTACH authenticated user to request
        req.user = decoded;

        next();

    }catch(error){
        return res.status(401).json({
            success: false,
            message:"Invalid or expired token", 
        });
    }
};