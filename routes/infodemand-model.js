const db = require("../data/dbConfig");
const DRYParser = require("../sessionsDataParser");

// const add = (info_row) => db('information_demand').insert(info_row)

const add = async function(info_row) {
  

  x = await db("information_demand").insert(info_row);
  console.log(await x, info_row.id);
  return x;
};

const addition = async function(info_row) {
  console.log(info_row);
  x = await db("info_demand_2").insert(info_row);
  return x;
};

const get = () => db("information_demand");

module.exports = {
  add,
  get,
  addition
};
