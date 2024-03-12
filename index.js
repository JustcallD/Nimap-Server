const { app } = require("./App.js");

app.listen(process.env.PORT || 4002, () => {
  console.log(
    `Server is running at port : http://localhost:${
      process.env.PORT || 4002
    } \n`
  );
});

// var conn = mysql.createConnection({
//   host: "nimapsql.mysql.database.azure.com",
//   user: "justcalld",
//   password: "{your_password}",
//   database: "{your_database}",
//   port: 3306,
//   ssl: { ca: fs.readFileSync("{ca-cert filename}") },
// });

// host: 'sql.freedb.tech',
// user: 'freedb_adminmohit',
// password: 'B!c8tYCpW@yxSW3',
// database: 'freedb_nimaptask'