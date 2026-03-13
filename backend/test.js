require("dotenv").config();

const { connectDB } = require("./src/config/db");
const { searchNewToOld } = require("./src/services/searchNewToOld.service");

async function test() {

  await connectDB();

  const data = await searchNewToOld("Hoa");

  console.log("Result:", data);

  process.exit();

}

test();