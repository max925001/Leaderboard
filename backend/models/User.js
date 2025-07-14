import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'
import  Jwt  from "jsonwebtoken";
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true,select:false },
  totalPoints: { type: Number, default: 0, index: true }, // Index for faster sorting
  rank: { type: Number, default: 0 },
});
userSchema.pre('save' , async function(next){
    if(!this.isModified('password')){
        return next()
    }
    this.password =  await bcrypt.hash(this.password,10)
})

userSchema.methods ={
    generateJWTtoken:  async function(){
        return await Jwt.sign(
            {
                id: this._id ,username:this.username
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRY
            }
        )
    }
,
comparePassword: async function(plaintextPassword){

    return  await bcrypt.compare(plaintextPassword,this.password)
}
}


export default mongoose.model('User', userSchema);