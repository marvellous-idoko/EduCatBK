
const pin = require('./schema/pin')

module.exports = {
     checkPinUsage: async (pinz) =>{
    var pinn = await pin.findOne({pin:pinz})
    if(pinn == null ) return true
   else return  pinn.used
},
   createPin: async function (id,noOfT,res) {
 
      let yu = new pin()
      yu.id = id
      yu.noOfTimes = noOfT
      yu.used = false
      yu.dateCreated = new Date()
      yu.value = Math.floor(Math.random()*100000000)
      try{
         yu.save((e,r)=>{
           if(e) throw e 
             else res.json({code:1,msg:r})
         })

      }catch(e){
         res.json({code:0,msg:'Err: '+e})
      }
   }
}