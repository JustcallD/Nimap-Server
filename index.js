const dotenv = require("dotenv");
const connectDB = require("./Config/DB_Config.js");
const { app } = require("./App.js");

dotenv.config();

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 4002, () => {
      console.log(
        `Server is running at port : http://localhost:${process.env.PORT} \n`
      );
    });
  })
  .catch((err) => {
    console.log("MONGO db connection failed !!! ", err);
  });
