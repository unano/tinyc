const mongoose = require('mongoose');

const connectDB = async () =>{
    try {
        await mongoose
          .connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
          })
          .then(() => {
            console.log("DB Connetion Successfull");
          });
    } catch(error){
        console.log(err.message);
    }
}

module.exports = connectDB;