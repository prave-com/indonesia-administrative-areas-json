const fs = require('fs')
const csv = require('csv-parser')

// Read CSV file
const results = []
fs.createReadStream('data.csv')
  .pipe(csv())
  .on('data', (data) => results.push(data))
  .on('end', () => {
    const jsonResult = {
      INDONESIA: {
        Code: '62',
        Name: 'Indonesia',
        Provinces: {},
      },
    }

    const provinces = {}

    results.forEach((record) => {
      const code = record.kode
      const name = record.nama

      console.log(record)

      const parts = code.split('.')
      if (parts.length === 1) {
        // Province
        provinces[name] = {
          Code: parts[0],
          Name: name,
          Cities: {},
        }
      } else if (parts.length === 2) {
        // City
        const provinceName = findNameByCode(parts[0], provinces)
        if (provinceName) {
          provinces[provinceName].Cities[name] = {
            Code: parts[1],
            Name: name,
            Districts: {},
          }
        }
      } else if (parts.length === 3) {
        // District
        const cityName = findCityNameByCode(parts.slice(0, 2), provinces)
        if (cityName) {
          const city =
            provinces[findNameByCode(parts[0], provinces)].Cities[cityName]
          city.Districts[name] = {
            Code: parts[2],
            Name: name,
            Neighborhoods: {},
          }
        }
      } else if (parts.length === 4) {
        // Neighborhood
        const districtName = findDistrictNameByCode(
          parts.slice(0, 3),
          provinces,
        )
        if (districtName) {
          const district =
            provinces[findNameByCode(parts[0], provinces)].Cities[
              findCityNameByCode(parts.slice(0, 2), provinces)
            ].Districts[districtName]

          district.Neighborhoods[name] = {
            Code: parts[3],
            Name: name,
          }
        }
      }
    })

    jsonResult.INDONESIA.Provinces = provinces

    // Write result to JSON file
    fs.writeFile('data.json', JSON.stringify(jsonResult, null, 2), (err) => {
      if (err) {
        console.error('Error writing JSON file:', err)
      } else {
        console.log('JSON file has been created successfully.')
      }
    })
  })

function findNameByCode(code, provinces) {
  for (const [name, province] of Object.entries(provinces)) {
    if (province.Code === code) {
      return name
    }
  }
  return null
}

function findCityNameByCode(code, provinces) {
  const [provinceCode, cityCode] = code

  for (const province of Object.values(provinces)) {
    for (const [cityName, city] of Object.entries(province.Cities)) {
      if (province.Code == provinceCode && city.Code === cityCode) {
        return cityName
      }
    }
  }
  return null
}

function findDistrictNameByCode(code, provinces) {
  const [provinceCode, cityCode, districtCode] = code

  for (const province of Object.values(provinces)) {
    for (const city of Object.values(province.Cities)) {
      for (const [districtName, district] of Object.entries(city.Districts)) {
        if (
          province.Code == provinceCode &&
          city.Code === cityCode &&
          district.Code === districtCode
        ) {
          return districtName
        }
      }
    }
  }
  return null
}
