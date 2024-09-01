const fs = require('fs')
const csv = require('csv-parser')

// Read CSV file
const results = []
fs.createReadStream('data.csv')
  .pipe(csv())
  .on('data', (data) => results.push(data))
  .on('end', () => {
    const jsonResult = {
      62: {
        name: 'Indonesia',
        provinces: {},
      },
    }

    const provinces = {}

    results.forEach((record) => {
      const code = record.kode
      const name = record.nama

      const parts = code.split('.')
      if (parts.length === 1) {
        // Province
        provinces[parts[0]] = {
          name: name,
          cities: {},
        }
      } else if (parts.length === 2) {
        // City
        try {
          provinces[parts[0]].cities[parts[1]] = {
            name: name,
            districts: {},
          }
        } catch (e) {
          console.log(e)
        }
      } else if (parts.length === 3) {
        // District
        try {
          provinces[parts[0]].cities[parts[1]].districts[parts[2]] = {
            name: name,
            neighborhoods: {},
          }
        } catch (e) {
          console.log(e)
        }
      } else if (parts.length === 4) {
        // Neighborhood
        try {
          provinces[parts[0]].cities[parts[1]].districts[
            parts[2]
          ].neighborhoods[parts[3]] = {
            name: name,
          }
        } catch (e) {
          console.log(e)
        }
      }
    })

    jsonResult['62'].provinces = provinces

    // Write result to JSON file
    fs.writeFile('data.json', JSON.stringify(jsonResult, null, 2), (err) => {
      if (err) {
        console.error('Error writing JSON file:', err)
      } else {
        console.log('JSON file has been created successfully.')
      }
    })
  })
