const mongoose=require("mongoose")

const mongoUrl="mongodb://localhost:27017/votingApplication"
mongoose.connect(mongoUrl);
const dataBase = mongoose.connection;

dataBase.on('connected',()=>{
    console.log('connected to mongo db and mongoose')
})

dataBase.on('error',(err)=>{
    console.log('error', err)
})


dataBase.on('disconnected',()=>{
    console.log('disconnected to mongo db and mongoose ')
})


module.exports=dataBase;