angular.module('app.services', ['ngResource'])

  .constant('ApiEndpoint', {
    url: 'http://api-andreasmartin.rhcloud.com/api'
  })

  .factory('CustomersFactory', function ($resource, ApiEndpoint) {
    return $resource(ApiEndpoint.url + '/v1/customer', {}, {
      query: {method: 'GET', isArray: true},
      update: {method: 'PUT'},
      create: {method: 'POST'}
    })
  })

  .factory('CustomerFactory', function ($resource, ApiEndpoint) {
    return $resource(ApiEndpoint.url + '/v1/customer/:id', {}, {
      show: {method: 'GET'},
      delete: {method: 'DELETE', params: {id: '@id'}}
    })
  });
