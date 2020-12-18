const weatherApi = require('openweather-apis')

class Location {
  constructor(type, value) {
    this.type = type
    this.value = value
  }

  getWeather() {
    return (new Weather())
      .setLocation(this)
      .fetch()
  }

  static fromArray(locations)
  {
    let collection = []

    locations.forEach(location => {
      if (location.indexOf(",") === -1) {
        return collection.push(location)
      }

      location = location.split(",").map(s => s.trim()).filter(s => s !== '')
      collection = [...collection, ...Location.fromArray(location)]
    })

    return collection.map(location => {
      if (typeof location === 'object' && location !== null) return location

      if (/^\d+$/.test(location)) {
        return new Location('zip', location)
      }

      if (/^\D+$/.test(location)) {
        return new Location('city', location)
      }
    })
  }
}

class Weather {
  setLocation(location) {
    if (!(location instanceof Location)) {
      throw 'location parameter is not a Location object'
    }

    weatherApi.setZipCode(null)
    weatherApi.setCity('')

    if (location.type === 'city') {
      weatherApi.setCity(location.value)
    }

    if (location.type === 'zip') {
      weatherApi.setZipCode(location.value)
    }

    return this
  }

  fetch() {
    return new Promise((resolve, reject) => {
      weatherApi.getAllWeather(function(err, response) {
        if (err !== null) {
          return reject(err)
        }

        if (response.cod >= 400) {
          let city = weatherApi.getCity()
          return reject(`${response.message}: ${city}`)
        }

        return resolve(response)
      })
    })
  }
}

module.exports = {
  Location,
  Weather
}
