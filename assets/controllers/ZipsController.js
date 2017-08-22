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
		$scope.showRegionDetails = false;

		var regionMedianHouseholdIncomeMap = [];
		regionMedianHouseholdIncomeMap['Alabama'] = "$44,765";
		regionMedianHouseholdIncomeMap['Alaska'] = "$73,355";
		regionMedianHouseholdIncomeMap['Arizona'] = "$51,492";
		regionMedianHouseholdIncomeMap['Arkansas'] = "$41,995";
		regionMedianHouseholdIncomeMap['California'] = "$64,500";
		regionMedianHouseholdIncomeMap['Colorado'] = "$63,909";
		regionMedianHouseholdIncomeMap['Connecticut'] = "$71,346";
		regionMedianHouseholdIncomeMap['Delaware'] = "$61,255";
		regionMedianHouseholdIncomeMap['Florida'] = "$49,426";
		regionMedianHouseholdIncomeMap['Georgia'] = "$51,244";
		regionMedianHouseholdIncomeMap['Hawaii'] = "$73,486";
		regionMedianHouseholdIncomeMap['Idaho'] = "$48,275";
		regionMedianHouseholdIncomeMap['Illinois'] = "$59,588";
		regionMedianHouseholdIncomeMap['Indiana'] = "$50,532";
		regionMedianHouseholdIncomeMap['Iowa'] = "$54,736";
		regionMedianHouseholdIncomeMap['Kansas'] = "$53,906";
		regionMedianHouseholdIncomeMap['Kentucky'] = "$45,215";
		regionMedianHouseholdIncomeMap['Louisiana'] = "$45,727";
		regionMedianHouseholdIncomeMap['Maine'] = "$51,494";
		regionMedianHouseholdIncomeMap['Maryland'] = "$75,847";
		regionMedianHouseholdIncomeMap['Massachusetts'] = "$70,628";
		regionMedianHouseholdIncomeMap['Michigan'] = "$51,084";
		regionMedianHouseholdIncomeMap['Minnesota'] = "$63,488";
		regionMedianHouseholdIncomeMap['Mississippi'] = "$40,593";
		regionMedianHouseholdIncomeMap['Missouri'] = "$50,238";
		regionMedianHouseholdIncomeMap['Montana'] = "$49,509";
		regionMedianHouseholdIncomeMap['Nebraska'] = "$54,996";
		regionMedianHouseholdIncomeMap['Nevada'] = "$52,431";
		regionMedianHouseholdIncomeMap['New Hampshire'] = "$70,303";
		regionMedianHouseholdIncomeMap['New Jersey'] = "$72,222";
		regionMedianHouseholdIncomeMap['New Mexico'] = "$45,382";
		regionMedianHouseholdIncomeMap['New York'] = "$60,850";
		regionMedianHouseholdIncomeMap['North Carolina'] = "$47,830";
		regionMedianHouseholdIncomeMap['North Dakota'] = "$60,557";
		regionMedianHouseholdIncomeMap['Ohio'] = "$51,075";
		regionMedianHouseholdIncomeMap['Oklahoma'] = "$48,568";
		regionMedianHouseholdIncomeMap['Oregon'] = "$54,148";
		regionMedianHouseholdIncomeMap['Pennsylvania'] = "$55,702";
		regionMedianHouseholdIncomeMap['Rhode Island'] = "$58,073";
		regionMedianHouseholdIncomeMap['South Carolina'] = "$47,238";
		regionMedianHouseholdIncomeMap['South Dakota'] = "$53,017";
		regionMedianHouseholdIncomeMap['Tennessee'] = "$47,275";
		regionMedianHouseholdIncomeMap['Texas'] = "$55,653";
		regionMedianHouseholdIncomeMap['Utah'] = "$62,912";
		regionMedianHouseholdIncomeMap['Vermont'] = "$56,990";
		regionMedianHouseholdIncomeMap['Virginia'] = "$66,262";
		regionMedianHouseholdIncomeMap['Washington'] = "$64,129";
		regionMedianHouseholdIncomeMap['West Virginia'] = "$42,019";
		regionMedianHouseholdIncomeMap['Wisconsin'] = "$55,638";
		regionMedianHouseholdIncomeMap['Wyoming'] = "$60,214";

		regionMedianHouseholdIncomeMap['District of Columbia'] = "$75,628";
		regionMedianHouseholdIncomeMap['Puerto Rico'] = "$18,626";

		regionMedianHouseholdIncomeMap['United States'] = "$55,775";
		
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
				});
			});
		});

		$scope.showRegion = function(region) {
			$scope.showRegionDetails = true;
			$scope.regionName = region;
			subscriberMgmt.getSubscribersByRegion(region).then(function(regionSubscribers) {
				$scope.regionSubscribersCount = regionSubscribers.length;
				$scope.regionMedianHouseholdIncome = regionMedianHouseholdIncomeMap[region];
			});
		}

	}

}());
