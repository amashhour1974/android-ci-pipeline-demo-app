var Swagger = require('swagger-client');

var SWAGGER_URL = 'http://localhost:7100/api/v1/swagger.json'
var AUTH_TOKEN  = process.env.AUTH_TOKEN


var client = new Swagger({
  url: SWAGGER_URL
, usePromise: true
, authorizations: {
    accessTokenAuth: new Swagger.ApiKeyAuthorization('Authorization', 'Bearer ' + AUTH_TOKEN, 'header')
  }
})

var serial = process.argv.slice(2)[0]

client.then(function(api) {
  return api.user.getUserDevices({
    serial: serial
  , fields: 'serial,present,ready,using,owner'
  }).then(function(res) {
      // check if device can be added or not
      var devices = res.obj.devices

      var hasDevice = false
      devices.forEach(function(device) {
        if(device.serial === serial) {
          hasDevice = true;
        }
      })

      if (!hasDevice) {
        throw new Error('You are not owner')
      }

      return api.user.deleteUserDeviceBySerial({
        serial: serial
      }).then(function(res) {
        if (!res.obj.success) {
          throw new Error('Could not disconnect to device')
        }

        console.log('Device disconnected successfully!')
      })
  })
})
