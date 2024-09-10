angular
  .module("myApp", ["ngRoute"])
  .config(function ($routeProvider) {
    $routeProvider
      .when("/", {
        templateUrl: "pages/country-list.html",
        controller: "CountryListController",
      })
      .when("/country/:id", {
        templateUrl: "pages/country-detail.html",
        controller: "CountryDetailController",
      })
      .otherwise({ redirectTo: "/" });
  })
  .controller("CountryListController", function ($scope, $http, $location) {
    $scope.countries = [];
    $scope.filteredCountries = [];
    $scope.searchText = "";
    $scope.selectedRegion = "";

    $http
      .get("./data/data.json")
      .then(function (response) {
        $scope.countries = response.data.map(function (country, index) {
          country.id = index;
          return country;
        });
        $scope.filteredCountries = $scope.countries;
      })
      .catch(function (error) {
        console.error("Error fetching country data:", error);
      });

    $scope.filterByRegion = function () {
      if ($scope.selectedRegion === "") {
        $scope.filteredCountries = $scope.countries;
      } else {
        $scope.filteredCountries = $scope.countries.filter(function (country) {
          return country.region === $scope.selectedRegion;
        });
      }
    };

    $scope.$watch("selectedRegion", function () {
      $scope.filterByRegion();
    });

    $scope.showCountryDetails = function (countryId) {
      $location.path("/country/" + countryId);
    };
  })
  .controller(
    "CountryDetailController",
    function ($scope, $http, $routeParams) {
      $scope.country = null;

      $http
        .get("./data/data.json")
        .then(function (response) {
          $scope.country = response.data[$routeParams.id];
        })
        .catch(function (error) {
          console.error("Error fetching country data:", error);
        });
    }
  );
