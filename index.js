require("dotenv").config();

const server = require("./api/server");
console.log(`This is the ${process.env.DB_ENV}`);

const port = process.env.PORT || 8000;
server.listen(port, () => {
  console.log(`\n** Running on port ${port} **\n`);
});