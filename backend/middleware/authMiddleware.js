import jwt from "jsonwebtoken"

const isLoggedIn = async (req ,res, next) =>{

     const {token} = req.cookies


   
    console.log("token",token)
    if(!token){
       
        return res.status(401).json({ success:false, message: 'Unauthorized' });
    }
    //console.log(token)

const userDetails =  await jwt.verify(token,process.env.JWT_SECRET)
console.log(userDetails)
req.user = userDetails;
console.log("userdetails",req.user)
next()
}

export{
    isLoggedIn    
    
}