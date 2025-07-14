import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const cookieOptions = {
    maxAge: 7*24*60*60*1000,
    httpOnly: true,
     secure: process.env.NODE_ENV === 'production' ? true : false,
    sameSite:'None',
    secure: true,
   

}
export const signup = async (req, res,next) => {
  const { name,username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ success:false, message: 'User already exists' });

    
  const user = await User.create({
   name, username,password
  })
  if(!user){
    return res.status(500).json({ success:false, message: 'User creation failed' });
  }
      await user.save();
      user.password=undefined


    const token = await user.generateJWTtoken();
   
    res.cookie('token' ,token ,cookieOptions)
  
    return res.status(201).json({ success:true, message: 'User created successfully', user,token });

  
   
  } catch (error) {
    return res.status(500).json({ success:false, message: 'Server error' });
  }
};

export const login = async (req, res,next) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username }).select('+password');
    if (!user) return res.status(400).json({ success:false, message: 'Invalid credentials' });

     const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(400).json({ success:false, message: 'Invalid credentials' });
  }


const token = await user.generateJWTtoken()
user.password = undefined
console.log("token",token)
res.cookie('token' ,token ,cookieOptions)
return res.status(200).json({
success: true,
message:'User Login Successfully',
user,
token

})
  } catch (error) {
    returnres.status(500).json({ success:false,message: 'Server error' });
  }
};

export const logout = (req,res) =>{

res.cookie('token' ,null ,{
    maxAge:0,
    httpOnly:true

})

res.status(200).json({
    success:true,
    message:'User Logout Successfully'

})

}

export const getUserData = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if(!user) {
      return res.status(404).json({success:false, message: 'User not found' });
    }

    return res.status(200).json({ success:true, user });
  } catch (error) {
     return res.status(500).json({ success:false,message: 'Server error' });
  }
};