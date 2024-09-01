const fs = require('fs')
const csv = require('csv-parser')

// Membaca file CSV
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
        // Provinsi
        provinces[name] = {
          Code: code,
          Name: name,
          Cities: {},
        }
      } else if (parts.length === 2) {
        // Kota
        const provinceName = findNameByCode(
          parts.slice(0, 1).join('.'),
          provinces,
        )
        if (provinceName) {
          provinces[provinceName].Cities[name] = {
            Code: code,
            Name: name,
            Districts: {},
          }
        }
      } else if (parts.length === 3) {
        // Kecamatan
        const cityName = findCityNameByCode(
          parts.slice(0, 2).join('.'),
          provinces,
        )
        if (cityName) {
          const city =
            provinces[findNameByCode(parts.slice(0, 1).join('.'), provinces)]
              .Cities[cityName]
          city.Districts[name] = {
            Code: code,
            Name: name,
            Neighborhoods: {},
          }
        }
      } else if (parts.length === 4) {
        // Kelurahan
        const districtName = findDistrictNameByCode(
          parts.slice(0, 3).join('.'),
          provinces,
        )
        if (districtName) {
          const district =
            provinces[findNameByCode(parts.slice(0, 1).join('.'), provinces)]
              .Cities[
              findCityNameByCode(parts.slice(0, 2).join('.'), provinces)
            ].Districts[districtName]

          district.Neighborhoods[name] = {
            Code: code,
            Name: name,
          }
        }
      }
    })

    jsonResult.INDONESIA.Provinces = provinces

    // Menulis hasil ke file JSON
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
  for (const province of Object.values(provinces)) {
    for (const [cityName, city] of Object.entries(province.Cities)) {
      if (city.Code === code) {
        return cityName
      }
    }
  }
  return null
}

function findDistrictNameByCode(code, provinces) {
  for (const province of Object.values(provinces)) {
    for (const city of Object.values(province.Cities)) {
      for (const [districtName, district] of Object.entries(city.Districts)) {
        if (district.Code === code) {
          return districtName
        }
      }
    }
  }
  return null
}
