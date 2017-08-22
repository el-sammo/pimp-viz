(function() {
	'use strict';

	var app = angular.module('app');

	///
	// Controller: Zips
	///

	app.config(config);

	config.$inject = [
		'httpInterceptorProvider'
	];

	function config(httpInterceptorProvider) {
		httpInterceptorProvider.register(/^\/zips/);
	}


	app.controller('ZipsController', controller);
	
	controller.$inject = [
		'$window', '$scope', '$http', '$routeParams', '$modal', '$timeout',
		'$rootScope', '$q', '$sce',
		'querystring', 'configMgr', 'subscriberMgmt'
	];

	function controller(
		$window, $scope, $http, $routeParams, $modal, $timeout,
		$rootScope, $q, $sce,
		querystring, configMgr, subscriberMgmt
	) {

		// variable declarations
		
		$scope.subs = [];

//		subscriberMgmt.getAllSubscribers().then(function(subscribers) {
//			var lastZip = subscribers[0].zip;
//			var zipCount = 0;
//			subscribers.forEach(function(subscriber) {
//				if(subscriber.zip !== lastZip) {
//					var lastSubZip = {
//						zip: lastZip,
//						count: zipCount
//					};
//					$scope.subs.push(lastSubZip);
//					zipCount = 0;
//				}
//				zipCount ++;
//				lastZip = subscriber.zip;
//			});
//
//			$scope.src = $sce.trustAsResourceUrl(
//				'https://www.google.com/maps/embed/v1/place?' + querystring.stringify({
//					key: 'AIzaSyDWmhNy8HrlrxJXAE5rIvvmxlKHEQ5FR1E',
//					q: ([
//						subscribers[0].address_1,
//						subscribers[0].city,
//						subscribers[0].region,
//						subscribers[0].zip
//					].join('+'))
//				})
//			);
//		});

		$scope.regionsData = [];

		subscriberMgmt.getSubscriberRegions().then(function(regions) {
			regions.forEach(function(region) {
				subscriberMgmt.getSubscribersByRegion(region).then(function(regionSubs) {
					var regionCount = regionSubs.length;
					$scope.regionsData[region] = regionCount;
console.log('$scope.regionsData:');
console.log($scope.regionsData);
				});
			});
		});

		$scope.showRegion = function(region) {
console.log('showRegion() called with '+region);
		}

	}

}());
