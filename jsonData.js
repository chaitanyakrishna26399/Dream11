const fs = require('fs').promises;

// Specify the path to your JSON file
const filePath = './data/match.json';

// Function to read JSON data from file
async function readJsonFile() {
  try {
    // Read the contents of the file
    const data = await fs.readFile(filePath, 'utf8');

    // Parse the JSON data
    const jsonData = JSON.parse(data);

    return jsonData;
  } catch (error) {
    console.error('Error reading JSON file:', error);
    throw error;
  }
}

let read = async function readPlayerJsonFile() {
  try {
    // Read the contents of the file
    const data = await fs.readFile('./data/players.json', 'utf8');

    // Parse the JSON data
    const jsonData = await JSON.parse(data);

    return jsonData;
  } catch (error) {
    console.error('Error reading JSON file:', error);
    throw error;
  }
}

module.exports = {
  readJson: read,
  readJsonFile: readJsonFile
}
