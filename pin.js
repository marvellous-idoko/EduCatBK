
const pin = require('./schema/pin')

module.exports = {
   checkPinUsage: async (pinz, term = '', session = '', id = '') => {
      let pinn = await pin.findOne({ value: pinz })
      if (pinn == null) {
         return true
      }
      else if (pinn.noOfTimesUsed == 1) {
         if (pinn.term == term) {     
            if (pinn.session == session) {
               console.log(pinn.id, id)
               if (pinn.id == id) {
                  console.log('bbjbj')
                  if (pinn.noOfTimes == pinn.noOfTimesUsed) {
                     pinn.used = false
                     pinn.save()
                     return true
                  }
                  else {
                     pinn.noOfTimesUsed = (pinn.noOfTimesUsed + 1)
                     pinn.save()
                     return false
                  }
               } else {
                  return true
               }
               // pinn.noOfTimesUsed = (pinn.noOfTimesUsed + 1)
               // pinn.save()
               // return false
            }
         } else {
            return true
         }
      }
      else {

         if (pinn.noOfTimes == pinn.noOfTimesUsed) {
            pinn.used = false
            pinn.save()
            return true
         }
         else {
            pinn.noOfTimesUsed = (pinn.noOfTimesUsed + 1)
            pinn.term = term
            pinn.session = session
            if(!pinn.id){
               console.log('love!!')
               pinn.id = id
            }
            let u = await pinn.save()
            console.log(u)
            return false
         }
      }
   },
   createPin: async function (id, noOfT = 1, res,schId='') {
      let r = {}
      let yu = new pin()
      yu.id = id
      yu.noOfTimes = noOfT
      yu.noOfTimesUsed = 0
      yu.used = false
      yu.dateCreated = new Date()
      yu.schId = schId
      yu.value = Math.floor(Math.random() * 100000000)
      try {
         return await yu.save()
         
         // yu.save((e, r) => {
         //    if (e) throw e
         //    else res.json({ code: 1, msg: r })
         // })

      } catch (e) {
         res.json({ code: 0, msg: 'Err: ' + e })
      }
   },myPins: async function(id){
      return await pin.find({id:id})
   }
}