const jwt=require("jsonwebtoken");

function verifyToken(req,res,next){
    const authToken=req.headers.authorization;
    if(authToken){
        const token=authToken.split(" ")[1];
        try{
            const decodedPayload=jwt.verify(token,process.env.JWT_SECRET);
            req.user=decodedPayload;
            next();
        }catch(error){
            return res.status(401).json({message:"Invalid token. Access denied"});
        }
    }
    else{
        return res.status(401).json({message:"Token not provided. Access denied"});
    }
}

function verifyTokenAdmin(req,res,next){
    verifyToken(req,res,()=>{
        if(req.user.isAdmin){
            next();
        }else{
            return res.status(403).json({message:"Not allowed, admin only"});
        }
    })
}

function verifyTokenAndOnlyUser(req,res,next){
    verifyToken(req,res,()=>{
        if(req.user.id===req.params.id){
            next();
        }else{
            res.status(403).json({message:"Only user himself can update"});
        }
    });
}

function verifyTokenAndAuthorization(req,res,next){
    verifyToken(req,res,()=>{
        if(req.user.id===req.params.id||req.user.isAdmin){
            next();
        }else{
            res.status(403).json({message:"Only user himself or admin can update"});
        }
    });
}

module.exports={
    verifyToken,
    verifyTokenAdmin,
    verifyTokenAndOnlyUser,
    verifyTokenAndAuthorization
}