const mongoose=require('mongoose');
const voters = require('./voters');

const candidateSchema=new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    party:{ 
        type:String,
        required:true
    },
    votes:[
        {
            user:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'voters',// check her voters or Voters
                required:true
            },
            votedAt:{
                type:Date,
                default:Date.now()
            }
        }
    ],
    voteCounts:{
        type:Number,
        default:0
    },
    age: {
        type: Number,
        required: true
    },
    address: {
        type: String,
    
    },
    adhaar: {
        type: Number,
        required: true,
        minlength: 12,
        maxlength: 12
    },
    mobile: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 10
    },
    email: {
        type: String,
        required: true,
      
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






const Candidate = mongoose.model('Candidate', candidateSchema);

module.exports = Candidate;