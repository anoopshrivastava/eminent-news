const mongoose = require('mongoose')

ConnectToMongo=async()=>{
    
    await mongoose.connect(process.env.MONGODB_URL)
    .then((data)=>console.log(`Mongodb Connected Successfully on ${data.connection.host}`))

}
module.exports = ConnectToMongo;