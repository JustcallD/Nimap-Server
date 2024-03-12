const { app } = require("./App.js");

app.listen(process.env.PORT || 4002, () => {
  console.log(
    `Server is running at port : http://localhost:${
      process.env.PORT || 4002
    } \n`
  );
});

