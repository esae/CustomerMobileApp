angular.module('app.controllers', [])

  .controller('customerListCtrl', ['$scope', '$stateParams', '$state', 'CustomersFactory', 'CustomerFactory',
    function ($scope, $stateParams, $state, CustomersFactory, CustomerFactory) {
      /* callback for ng-click 'editCustomer': */
      $scope.editCustomer = function (customerId) {
        $state.go('customerEditor', {customerId: customerId});
      };

      /* callback for ng-click 'deleteCustomer': */
      $scope.deleteCustomer = function (customerId) {
        CustomerFactory.delete({id: customerId});
        $scope.customers = CustomersFactory.query();
        $state.reload();
      };

      /* callback for ng-click 'createCustomer': */
      $scope.createCustomer = function () {
        $state.go('customerEditorCreate');
      };

      /* callback ion-refresher: */
      $scope.refreshCustomer = function () {
        $scope.customers = CustomersFactory.query();
        $scope.$broadcast('scroll.refreshComplete');
      };

      $scope.customers = CustomersFactory.query();

      /* callback for ng-click 'addCustomerContact': */
      $scope.addCustomerContact = function (customerId) {
        CustomerFactory.show({id: customerId}).$promise.then(function (customer) {
          var contact = navigator.contacts.create({'displayName': customer.name});
          contact.name = new ContactName({'formatted': customer.name});
          contact.phoneNumbers = new Array(new ContactField('mobile', customer.mobile, true));
          contact.emails = new Array(new ContactField('work', customer.email, true));
          contact.save(function (contact) {
            alert("Save Success");
          }, function (contactError) {
            alert("Error = " + contactError.code);
          });
        });
      };

    }])

  .controller('customerEditorCtrl', ['$scope', '$stateParams', '$state', 'CustomersFactory', 'CustomerFactory',
    function ($scope, $stateParams, $state, CustomersFactory, CustomerFactory) {

      /* callback for ng-click 'editCustomer': */
      $scope.editCustomer = function () {
        CustomersFactory.update($scope.customer);
        $state.go('customerList', {}, {reload: true});
      };

      $scope.customer = CustomerFactory.show({id: $stateParams.customerId});

    }])

  .controller('customerEditorCreateCtrl', ['$scope', '$stateParams', '$state', 'CustomersFactory', 'CustomerFactory',
    function ($scope, $stateParams, $state, CustomersFactory, CustomerFactory) {

      /* callback for ng-click 'editCustomer': */
      $scope.editCustomer = function () {
        CustomersFactory.create($scope.customer);
        $state.go('customerList', {}, {reload: true});
      };

      $scope.customer = {};

    }]);
