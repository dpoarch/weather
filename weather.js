#!/usr/bin/env node

require('dotenv').config()
const cli = require('cac')()
const weatherApi = require('openweather-apis')
const { Location } = require('./src/Weather')

weatherApi.setLang(process.env.OPENWEATHER_LANG)
weatherApi.setAPPID(process.env.OPENWEATHER_API_KEY)

cli.command('<...locations>').action((locations) => {
  locations = Location.fromArray(locations)

  locations.forEach((location) => {
    location.getWeather()
      .then((data) => {
        const time = (new Date(data.dt * 1000)).toISOString()

        const weather = data.weather.reduce((description, weather) => {
          return `${weather.description}, ${description}`.replace(/, $/g, '')
        }, "")

        console.log(`${data.name}, ${data.sys.country} - ${weather} - ${time}`)
      }).catch(err => {
        console.error(err)
      })
    })
})

cli.parse()
