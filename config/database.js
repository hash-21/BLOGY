const mongoose = require("mongoose");

require("dotenv").config();

const dbConnect = async () => {
    mongoose.connect(process.env.DATABASE_URL)
    .then(() => console.log("DB Connection is Successful"))
    .catch( (error) => {
        console.log("Issue in DB Connection");
        console.error(error.message);
        process.exit(1);
    } );
}

module.exports = {dbConnect};