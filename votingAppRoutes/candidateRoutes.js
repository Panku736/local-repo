const express=require('express');
const jwt = require('jsonwebtoken');
const router =  express.Router();
const Candidate=require('../VotingAppSchema/candidates.js')
const voters=require('../VotingAppSchema/voters')

const {verifyToken}=require('../middlewares/auth.js')
const bcrypt = require('bcrypt');

const checkAdmin = async (userId) => {
    try {
        const user = await voters.findById(userId);
        
        // Check if user exists and has 'admin' role
        if (user && user.role === 'admin') {
            return true; // User is an admin
        } else {
            return false; // User is not an admin
        }
    } catch (err) {
        console.error('Error in checkAdmin:', err);
        return false; // Return false in case of any error
    }
};



router.post('/add',verifyToken,async(req,res)=>{
    try {
        if(!await checkAdmin(req.userId)){
          return  res.status(404).json({message:'not an admin role'})
        }
        const candidateData=req.body;
       
        const saveCandidate= new Candidate(candidateData)
        // const addingData=await new voters(voterData)
 
        // const response = await addingData.save()
        const response = await saveCandidate.save()
        console.log(response)
        return  res.status(200).json({
            message: 'data saved ',
            response 
        })
           
    } catch (err) {
        console.error('Error:', err); // Log the error for debugging purposes
        res.status(500).json({ err: 'Internal server error' });
    }
    
})


router.put('/update/:candidateId',verifyToken ,async (req,res)=>{
    try {
        const isAdmin=await checkAdmin(req.userId)
        if(!isAdmin){
            res.status(404).json({message:'not an admin role'})
        }
        let candidateId=req.params.candidateId
      
        let toUpdateData=req.body

        const response = await Candidate.findOneAndUpdate(
            { _id: candidateId }, // Query condition to find the document
            toUpdateData, // Data to update
            { new: true } // Option to return the updated document
        );
        console.log(response)
        if(!response){
            return res.status(404).json({error:"candidate not found"})
        }
                
        res.status(200).json({ success: true, updatedWork: response, message: "Candidate updated" });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: '  server error' });
    
    }
})

router.delete('/delete/:candidateId', verifyToken, async (req, res) => {
    try {
        // Check if the user is an admin
        const isAdmin = await checkAdmin(req.userId);
        
        // If the user is not an admin, return a 403 Forbidden response
        if (!isAdmin) {
            return res.status(403).json({ message: 'Unauthorized: not an admin role' });
        }
        
        // Extract candidateId from request parameters
        const candidateId = req.params.candidateId;
        
        // If candidateId is not provided, return a 404 Not Found response
        if (!candidateId) {
            return res.status(404).json({ error: "Candidate id not found" });
        }

        // Find and delete the candidate by candidateId
        const response = await Candidate.findByIdAndDelete(candidateId);

        // If candidate is not found, return a 404 Not Found response
        if (!response) {
            return res.status(404).json({ error: "Candidate not found" });
        }

        // Return a success message if deletion is successful
        res.status(200).json({ success: true, message: "Candidate deleted" });
    } catch (error) {
        // Handle any errors and return a 500 Internal Server Error response
        console.error('Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});


router.post("/vote/:candidateId",verifyToken,async (req,res)=>{
   try {
   
     candidateId=req.params.candidateId;
     userId=req.userId
    console.log("voter",  userId)

     const foundCandidate=await Candidate.findById(candidateId);
     

     if(!foundCandidate){ 
         return res.status(400).json({message:'candidate not found'})
     }
         const user=await voters.findById(userId);
        
         if(!user){
             return res.status(400).json({message:'user not found'})
         }
         if(user.isVoted){
             return res.status(400).json({message:'already voted'})
         }
 
         if(user.role==='admin'){
             return res.status(400).json({message:'admin not allowed to vote voted'})
         }
  
         
         foundCandidate.votes.push({user:userId})
         foundCandidate.voteCounts++
         await foundCandidate.save()
         user.isVoted=true 
         await user.save()

         res.status(200).json(message='vote done','you have voted to :', foundCandidate)
 
 
 
     }
     catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: '  server error' });
    
    }
})
 

router.get('/vote/count',async(req,res)=>{
    try {
        
        const TotalCandidate= await Candidate.find().sort({voteCounts:'desc'})

        const record=TotalCandidate.map((data)=>{
            return {
                party:data.party,
                count:data.voteCounts
            }
        })

        res.status(200).json(record);


    }  catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: '  server error' });
    
    }
})

router.get('/candidate/list',async(req,res)=>{
    try {
        
        const TotalCandidate= await Candidate.find({}, "-_id -adhaar -email");


       

        res.status(200).json(TotalCandidate);


    }  catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: '  server error' });
    
    }
})

module.exports = router;