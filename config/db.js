const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    };
    const conn = await mongoose.connect(
      "mongodb+srv://aditya:adityaagr00@cluster0.tzyhazw.mongodb.net/?retryWrites=true&w=majority",
      options
    );
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectDB;
