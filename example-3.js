import fs from "node:fs";
// import readline from 'node:readline';
import readline from "./index.js";

try {
  const rl = readline.createInterface({
    input: fs.createReadStream("./input.txt"),
    crlfDelay: Infinity,
  });

  rl.on("line", (line) => {
    console.log(`Line from file: ${line}`);
  });
} catch (error) {
  console.error(error);
}
