var jwt = require('jsonwebtoken');
const votersRoutes = require('../votingAppRoutes/votersRoutes.js');
const voters=require('../VotingAppSchema/voters.js')
module.exports.verifyToken=async (req,res,next)=>{
    try {

        let IncomingToken=req.headers.authorization

        if(IncomingToken && IncomingToken.startsWith('Bearer')){
            IncomingToken=IncomingToken.split(' ')[1];
            // console.log(' auth incoming token:  ',IncomingToken)
            const decodedToken= jwt.verify(IncomingToken,process.env.SECRET_KEY)
            // console.log(decodedToken)
            if(decodedToken){
                const tokenVoter =await voters.findOne({_id:decodedToken.voterId})
                if(tokenVoter ){
                    req.userId=decodedToken.voterId
                    next();
                }else{ 
                    return res.status(400).json({
                        success: false,
                        message: 'User not found',});
                }
            }
        }
    } catch (error) {
    
        return res.status(401).json({
            success: false,
            message: 'Failed to verify token',
        });
    }}

