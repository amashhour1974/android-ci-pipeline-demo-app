var Swagger = require('swagger-client');

var SWAGGER_URL = 'http://localhost:7100/api/v1/swagger.json'
var AUTH_TOKEN  = 'c0896d9ce0cd4a1395c92b075192067bde1b92af741841f69cd43269a090e1ff';


var client = new Swagger({
  url: SWAGGER_URL
, usePromise: true
, authorizations: {
    accessTokenAuth: new Swagger.ApiKeyAuthorization('Authorization', 'Bearer ' + AUTH_TOKEN, 'header')
  }
})

var serial = process.argv.slice(2)[0]

client.then(function(api) {
  return api.devices.getDeviceBySerial({
    serial: serial
  , fields: 'serial,present,ready,using,owner'
  }).then(function(res) {
      // check if device can be added or not
      var device = res.obj.device
      if (!device.present || !device.ready || device.using || device.owner) {
        throw new Error('Device is not available')
      }

      return api.user.addUserDevice({
        device: {
          serial: device.serial
        , timeout: 900000
        }
      }).then(function(res) {
        if (!res.obj.success) {
          throw new Error('Could not connect to device')
        }

        return api.user.remoteConnectUserDeviceBySerial({
          serial: device.serial
        }).then(function(res) {
          console.log(res.obj.remoteConnectUrl)
        })
      })
  })
})
