const express = require('express')
const app = express()

const dataBase=require('./dataBase.js')
const dotenv = require('dotenv');

const bodyParser=require('body-parser')

app.use(bodyParser.json())

// Import dotenv module, but environment variables are not yet loaded
dotenv.config();

// Routers
const voterRoutes= require('./votingAppRoutes/votersRoutes.js')

const candidateRoutes= require('./votingAppRoutes/candidateRoutes.js')

// usage of routes
app.use('/voters', voterRoutes)
app.use('/candidate', candidateRoutes)

 









app.listen(process.env.PORT||3500,()=>{
   console.log("voting app server")
})