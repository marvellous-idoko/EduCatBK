
const pin = require('./schema/pin')

module.exports = {
   checkPinUsage: async (pinz) => {
      console.log(pinz)
      let pinn = await pin.findOne({ value: pinz })
      if (pinn == null) {
         return true
      }
      else{
      if(pinn.noOfTimes == pinn.noOfTimesUsed){
         pinn.used = false
         pinn.save()
         return true

      }
      else{
         pinn.noOfTimesUsed = (pinn.noOfTimesUsed + 1)
          pinn.save()
         return false
      }
      } 
   },
   createPin: async function (id, noOfT, res) {

      let yu = new pin()
      yu.id = id
      yu.noOfTimes = noOfT
      yu.noOfTimesUsed = 0
      yu.used = false
      yu.dateCreated = new Date()
      yu.value = Math.floor(Math.random() * 100000000)
      try {
         yu.save((e, r) => {
            if (e) throw e
            else res.json({ code: 1, msg: r })
         })

      } catch (e) {
         res.json({ code: 0, msg: 'Err: ' + e })
      }
   }
}