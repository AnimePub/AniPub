const jwt = require("jsonwebtoken");
const apikey = process.env.apikey;
const Data = require("../models/model");
const isKeyValid = async (req,res,next) =>{
    const key = req.headers.apikey ;
    if(key) {
        try {
                 const data = await jwt.verify(key, apikey);
                   if(data) {
                    Data.findByIdAndUpdate(data.id,{
                        $inc:{count:1}
                    })
                    .then(()=>{
                        next();
                    })
                    
                   }
                }
                catch (err) {
                    res.json({message:`Invalid API key .. to get an API key visit www.anipub.xyz/APIKEY ..
            We set up key so that bots can't overwhelm our servers`}) 
                }
    }
    else {
        res.json({message:`Please provide api key ..to get an API key visit www.anipub.xyz/APIKEY ..
            We set up key so that bots can't overwhelm our servers `});
    }
    
}
module.exports = isKeyValid;