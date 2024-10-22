const express = require('express')
const cors = require('cors')
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const app = express();

const port = 3001;

app.use(cors())

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
})

function readExcel(filePath) {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    const data = xlsx.utils.sheet_to_json(worksheet);
    return data;
}

// const excelFilePath = './data/population-and-demography.xlsx';
// const excelData = readExcel(excelFilePath);

function findDataByCriteria(data, entities, year) {
    return data.filter(
        (row) =>
            entities.includes(row.Entity) &&
            row.Year === parseInt(year)
    );
}

app.get('/api/getdata', (req, res) => {
    const years = req.query.years;
    const excelFilePath = path.join(__dirname, 'data', 'population-and-demography.xlsx')
    const excelData = readExcel(excelFilePath)

    const entities = ['Chaina','India','United States','Russia','Japan','Indonesia','Germany','Brazil','United Kingdom','Italy', 'Bangladesh','France'];

    const result = findDataByCriteria(excelData,entities,years)

    if(result){
        res.status(200).json(result)
    }else{
        res.status(404).json({message:"Data not found"})
    }
})