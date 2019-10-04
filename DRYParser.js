//this will be used to create the if/else statements for the request types
require("dotenv").config();
const Sessions = require("./routes/sessions-model");
let unserializer = require("php-unserialize");
const bcrypt = require("bcryptjs");
const InfoDemand = require("./routes/infodemand-model");

const request_types = [
  "procedurecommodity",
  "procedurecommoditycat",
  "proceduredest",
  "procedurerequireddocument",
  "procedurerelevantagency",
  "procedureorigin",
  "commoditycountry",
  "commoditymarket",
  "commoditycat",
  "commodityproduct",
  "exchangedirection"
];

try {
  //accessing the session model and and the platform sessions table
  Sessions.findLanceData().then(
    //sessions is the entire platform sessions table(array)
    sessions => {
      // console.log('sessions size', sessions.length);

      //sessions filtering through each row and grabbing/getting each row that has non-zero data field
      //we don't need to unserialize if it doesn't have data
      let array = sessions.filter(row => {
        return row.data.length > 0;
      });

      // console.log('Array size', array.length);
      //slicing the array to condense the amount of data retrieved/taking a subset of 2 sessions:
      let newArr = array; //.slice(0, 1000);

      // making a new array
      let infoArr = [];

      // const test_data_544 = unserializer.unserialize(
      //   'a:9:{s:21:"procedurecommoditycat";a:2:{i:0;s:7:"Cereals";i:1;s:6:"Pulses";}s:18:"procedurecommodity";a:2:{i:0;s:7:"Sorghum";i:1;s:10:"Groundnuts";}s:13:"proceduredest";a:2:{i:0;s:3:"KEN";i:1;s:3:"KEN";}s:15:"procedureorigin";a:2:{i:0;s:3:"EAC";i:1;s:3:"EAC";}s:14:"procedurevalue";a:2:{i:0;s:22:"Greater than $2000 USD";i:1;s:19:"Less than $2000 USD";}s:16:"commoditycountry";a:1:{i:0;s:3:"KEN";}s:15:"commoditymarket";a:1:{i:0;s:5:"Kisii";}s:12:"commoditycat";a:1:{i:0;s:12:"Seeds & Nuts";}s:16:"commodityproduct";a:1:{i:0;s:10:"Groundnuts";}}'
      // );

      // console.log("544 bytes serialization successful", test_data_544);

      // const test_data_500 = unserializer.unserialize(
      //   'a:13:{s:16:"commoditycountry";s:3:"KEN";s:15:"commoditymarket";s:6:"Kisumu";s:12:"commoditycat";s:14:"Cereals - Rice";s:16:"commodityproduct";s:4:"Rice";s:15:"alertsmarketcat";s:15:"Cereals - Maize";s:19:"alertsmarketproduct";s:9:"Dry Maize";s:20:"alertsmarketcountry1";s:3:"KEN";s:13:"alertsmarket1";s:7:"Eldoret";s:21:"procedurecommoditycat";s:7:"Cereals";s:18:"procedurecommodity";s:16:"Rice - Processed";s:13:"proceduredest";s:3:"UGA";s:15:"procedureorigin";s:3:"EAC";s:14:"procedurevalue";s:3:"2'
      // );

      // console.log("500 bytes serialization successful", test_data_500);

      let err_count = 0;
      //looping through the new array
      newArr.forEach((serializedRow, index) => {
        // we created a variable and now we are unserializing the data that we looped through
        // console.log(serializedRow.data);
        try {
          const data = unserializer.unserialize(serializedRow.data);
          // console.log("sess_id: ", serializedRow.sess_id, " ", data);

          //Object.keys returning the enumerable keys from the data, looping through each key and pushing this info into the empty infoArr
          Object.keys(data).forEach(key => {
            // console.log("Key", keyEle);

            request_types.forEach(request_type => {
              if (key === request_type) {
                const request_value = data[key];
                if (typeof request_value === "string") {
                  infoArr.push({
                    id: infoArr.length, //incrementing the id by the length of the array
                    platform_sessions_id: serializedRow.sess_id, // from the serialized data in the newArr that was created from the sess_id: value
                    cell_num: serializedRow.cell_num, // from the serialized data in the newArr that was created from the cell_num: value
                    request_type_id: request_types.indexOf(key) + 1,
                    request_value: data[key] //request_value is receiving its value from the data variable which uses the key element as its index
                  });
                } else {
                  Object.values(request_value).forEach(value => {
                    infoArr.push({
                      id: infoArr.length, //incrementing the id by the length of the array
                      platform_sessions_id: serializedRow.sess_id, // from the serialized data in the newArr that was created from the sess_id: value
                      cell_num: serializedRow.cell_num, // from the serialized data in the newArr that was created from the cell_num: value
                      request_type_id: request_types.indexOf(key) + 1,
                      request_value: value //request_value is receiving its value from the data variable which uses the key element as its index
                    });
                  });
                  // console.log("not a string")
                  // console.log(request_value);
                }
              }
            });
          });
        } catch (err) {
          err_count++;
          console.log(
            "err count: ",
            err_count,
            "sess_id: ",
            serializedRow.sess_id
          );
        }
        // console.log('infoArr', infoArr); //Seeing if the array now has access to the key value pairs(data)
      });
      // console.log("infoArr", infoArr);
      console.log("infoArr length", infoArr.length);

      // for (var i = 0; i <= Math.floor(infoArr.length / 100); i++) {
      //   const infoArr2 = infoArr.slice(i * 100, i * 100 + 100);
      //   console.log(i);

      for (const info_row of infoArr.slice(53000, infoArr.length)) {
        try {
          // console.log("adding row...", info_row);
          InfoDemand.add(info_row);
        } catch ({ message }) {
          //
          console.log(message);
        }
      }

      // }
    }
  );
} catch ({ message }) {
  console.log("message", message);
} // if we don't successfully retrieve the data we should see an error message
//to run this script on the command line, type:  node testParser.js

module.exports = Sessions;
/** 11 if /else statements
 * procedurecommodity
 * procedurecommoditycat
 * proceduredest
 * procedurerequireddocument
 * procedurerelevantagency
 * procedureorigin
 * commoditycountry
 * commoditymarket
 * commoditycat
 * commodityproduct
 * exchangedirection
 *
 */
