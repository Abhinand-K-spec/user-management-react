import mongoose from "mongoose"; 

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,

    },
    password: {
        type: String,
        required: true
    },
    profileImage:{
        type:String
    },
    role: {
        type: String, default: 'user' 
    },
    lastname:{
        type:String
    }
})

const User = mongoose.model('User', userSchema);
export default User;