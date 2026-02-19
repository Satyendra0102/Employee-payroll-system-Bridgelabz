const fs = require("fs").promises;
const path = require("path");

const filePath = path.join(__dirname, "../employees.json");

async function readEmployees() {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.log("Read Error:", err);
    return [];
  }
}
async function writeEmployees(data) {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  } catch (err) {
    console.log("Write Error:", err);
  }
}

module.exports = { readEmployees, writeEmployees };
