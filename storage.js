const fs = require('fs');
const path = require('path');

let storage = {};

const loadData = (fileName) => {
    const filePath = path.join(__dirname, 'data', fileName);
    try {
        const data = fs.readFileSync(filePath, 'utf-8');
        storage[fileName] = JSON.parse(data) || [];
    } catch (err) {
        console.error(`Error loading data from ${fileName}:`, err);
        storage[fileName] = [];
    }
};

const saveData = (fileName, data) => {
    const filePath = path.join(__dirname, 'data', fileName);
    try {
        fs.writeFileSync(filePath, JSON.stringify(data || storage[fileName]));
        console.log(`Data saved to ${fileName}.`);
    } catch (err) {
        console.error(`Error creating data from ${fileName}:`, err);
    }
};

const saveAllData = () => {
    for (const fileName in storage) {
        saveData(fileName);
    }
}

const getData = (fileName) => storage[fileName] || [];
const setData = (fileName, data) => { storage[fileName] = data; };

module.exports = { loadData, saveData, saveAllData, getData, setData };