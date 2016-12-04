# Customer Mobile App Tutorial
## Project creation
Project creation using Ionic Lab and Ionic Creator files...
1.  Externalize the CSS code
    ```html
    <link href="css/style.css" rel="stylesheet">
    ```
## Services
1.  The starter.services module you just created has a dependency on the Angular resource module which is not included by default. Open index.html and add a script tag to include angular-resource.min.js (right after ionic-bundle.js):
    ```html
    <script src="lib/ionic/js/angular/angular-resource.min.js"></script>
    ```
2.  Implement two service factories
    ```javascript
      .constant('ApiEndpoint', {
        url: 'http://api-andreasmartin.rhcloud.com/api'
      })
    
      .factory('CustomersFactory', function ($resource) {
        return $resource(ApiEndpoint.url + '/v1/customer', {}, {
          query: {method: 'GET', isArray: true},
          update: {method: 'PUT'},
          create: {method: 'POST'}
        })
      })
    
      .factory('CustomerFactory', function ($resource) {
        return $resource(ApiEndpoint.url + '/v1/customer/:id', {}, {
          show: {method: 'GET'},
          delete: {method: 'DELETE', params: {id: '@id'}}
        })
      });
    ```
## Controllers
1.  Implement controllers
    