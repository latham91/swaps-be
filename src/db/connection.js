const mongoose = require("mongoose");

const dbConnect = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connected to database: ${conn.connection.name}`);
    } catch (error) {
        return console.error("Error connecting to the database: ", error);
    }
};

module.exports = dbConnect;
