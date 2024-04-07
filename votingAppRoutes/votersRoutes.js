const express=require('express');
const jwt = require('jsonwebtoken');
const router =  express.Router();
const voters=require('../VotingAppSchema/voters')
const {verifyToken}=require('../middlewares/auth.js')
const bcrypt = require('bcrypt');

router.post('/signup',async(req,res)=>{
    try {
        // if(!voterData||voterData.email||voterData.)
        const voterData=req.body;
        const voterExist = await voters.findOne({
            $or: [
                { adhaar: voterData.adhaar },
                { mobile: voterData.mobile },
                { email: voterData.email }
            ]
        })
        if (voterExist) {
            let existingFields = [];
            if (voterExist.adhaar === voterData.adhaar) {
                existingFields.push('Aadhaar');
            }
            if (voterExist.mobile === voterData.mobile) {
                existingFields.push('Mobile');
            }
            if (voterExist.email === voterData.email) {
                existingFields.push('Email');
            }
        
            return res.status(400).json({ 
                message: 'You are already signed up with existing details.',
                existingFields: existingFields
                
            } ) ;
        }
        console.log(voterData.mobile.length)
        if(voterData.mobile.length!==10){
            return res.status(400).json({ 
                message: 'enter valid mobile number',
            } ) ;
        }
        
        const hashedPassword= await bcrypt.hash(voterData.password,10)
        console.log('hashed' ,hashedPassword)
        voterData.password=hashedPassword
        const addingData=await new voters(voterData)

        const response = await addingData.save()
        console.log('responsee:',response);
        let token = jwt.sign({ voterId: response._id }, process.env.SECRET_KEY);
        return  res.status(200).json({
            message: 'data saved ',
            response,
            token
        })
           
    } catch (err) {
        console.log(err)
        res.status(500).json({err:'internal server error'})
    }
})


router.post('/login',async(req,res)=>{
    try {
        
      const  {adhaar,password}=req.body;
      if (!adhaar || !password) {
        return res.status(400).json({ message: 'Adhaar number and password are required.' });
    }
        const findVoter=await voters.findOne({adhaar:adhaar})
        if(!findVoter||! await bcrypt.compare(password,findVoter.password)){
            return res.status(404).json({message: 'invalid adhar or password'})
        }
        let token = jwt.sign({ voterId: findVoter._id }, process.env.SECRET_KEY);
        res.status(200).json({findVoter,token,message: 'login successfully'})

    } catch (err) { 
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
})


router.get('/profile',verifyToken ,async (req,res)=>{
    try {
        getId=req.userId
        console.log('req.body: ' , req.body)
        console.log("user id ", getId)
        const voterProfile=await voters.findOne({_id:getId})
        res.status(200).json({ success: true, voterProfile});
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    
    }
})


router.put('/profile/password',verifyToken ,async (req,res)=>{
    try {
        let getId=req.userId
        let voterProfile=await voters.findOne({_id:getId})
        let {currentPassword, newPassword}=req.body

        let checkPassword = await bcrypt.compare(currentPassword, voterProfile.password);
        if(!checkPassword){
            return res.status(400).json({ error: 'Incorrect password' });
        }
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        voterProfile.password = hashedNewPassword;
        await voterProfile.save(); 
        res.status(200).json({ success: true, voterProfile});
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    
    }
})



module.exports = router;