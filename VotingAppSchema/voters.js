const mongoose=require('mongoose');

const votersSchema=new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },

    age: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    adhaar: {
        type: Number,
        required: true,
        unique: true,
        minlength: 12,
        maxlength: 12
    },
    mobile: {
        type: String,
        required: true,
        unique: true,
        minlength: 10,
        maxlength: 10
    },
    email: {
        type: String,
        required: true,
        unique: true,
        // Add email validation if needed
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['voter','admin'],
        default:'voter'
    },
    isVoted:{
        type:Boolean,
        default:false
    }
})






const voters = mongoose.model('voters', votersSchema);
module.exports=voters