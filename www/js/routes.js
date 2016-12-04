angular.module('app.routes', [])

  .config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider

      .state('customerList', {
        url: '/customers',
        templateUrl: 'templates/customerList.html',
        controller: 'customerListCtrl'
      })

      .state('customerEditor', {
        url: '/editor/:customerId',
        templateUrl: 'templates/customerEditor.html',
        controller: 'customerEditorCtrl'
      })

      .state('customerEditorCreate', {
        url: '/editor',
        templateUrl: 'templates/customerEditor.html',
        controller: 'customerEditorCreateCtrl'
      });

    $urlRouterProvider.otherwise('/customers')

  });
