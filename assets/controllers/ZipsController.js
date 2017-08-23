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
		


		var regionPerCapitaIncomeMap = [];
		regionPerCapitaIncomeMap['Alabama'] = "$23,606";
		regionPerCapitaIncomeMap['Alaska'] = "$33,062";
		regionPerCapitaIncomeMap['Arizona'] = "$25,715";
		regionPerCapitaIncomeMap['Arkansas'] = "$22,883";
		regionPerCapitaIncomeMap['California'] = "$30,441";
		regionPerCapitaIncomeMap['Colorado'] = "$32,357";
		regionPerCapitaIncomeMap['Connecticut'] = "$39,373";
		regionPerCapitaIncomeMap['Delaware'] = "$30,488";
		regionPerCapitaIncomeMap['Florida'] = "$26,582";
		regionPerCapitaIncomeMap['Georgia'] = "$25,615";
		regionPerCapitaIncomeMap['Hawaii'] = "$29,736";
		regionPerCapitaIncomeMap['Idaho'] = "$23,938";
		regionPerCapitaIncomeMap['Illinois'] = "$30,417";
		regionPerCapitaIncomeMap['Indiana'] = "$25,140";
		regionPerCapitaIncomeMap['Iowa'] = "$28,361";
		regionPerCapitaIncomeMap['Kansas'] = "$27,870";
		regionPerCapitaIncomeMap['Kentucky'] = "$23,684";
		regionPerCapitaIncomeMap['Louisiana'] = "$24,800";
		regionPerCapitaIncomeMap['Maine'] = "$27,978";
		regionPerCapitaIncomeMap['Maryland'] = "$36,338";
		regionPerCapitaIncomeMap['Massachusetts'] = "$36,593";
		regionPerCapitaIncomeMap['Michigan'] = "$26,613";
		regionPerCapitaIncomeMap['Minnesota'] = "$32,638";
		regionPerCapitaIncomeMap['Mississippi'] = "$21,036";
		regionPerCapitaIncomeMap['Missouri'] = "$26,126";
		regionPerCapitaIncomeMap['Montana'] = "$25,989";
		regionPerCapitaIncomeMap['Nebraska'] = "$27,446";
		regionPerCapitaIncomeMap['Nevada'] = "$25,773";
		regionPerCapitaIncomeMap['New Hampshire'] = "$34,691";
		regionPerCapitaIncomeMap['New Jersey'] = "$37,288";
		regionPerCapitaIncomeMap['New Mexico'] = "$23,683";
		regionPerCapitaIncomeMap['New York'] = "$33,095";
		regionPerCapitaIncomeMap['North Carolina'] = "$25,774";
		regionPerCapitaIncomeMap['North Dakota'] = "$33,071";
		regionPerCapitaIncomeMap['Ohio'] = "$26,937";
		regionPerCapitaIncomeMap['Oklahoma'] = "$25,229";
		regionPerCapitaIncomeMap['Oregon'] = "$27,646";
		regionPerCapitaIncomeMap['Pennsylvania'] = "$29,220";
		regionPerCapitaIncomeMap['Rhode Island'] = "$30,830";
		regionPerCapitaIncomeMap['South Carolina'] = "$24,596";
		regionPerCapitaIncomeMap['South Dakota'] = "$26,959";
		regionPerCapitaIncomeMap['Tennessee'] = "$24,922";
		regionPerCapitaIncomeMap['Texas'] = "$27,125";
		regionPerCapitaIncomeMap['Utah'] = "$24,877";
		regionPerCapitaIncomeMap['Vermont'] = "$29,178";
		regionPerCapitaIncomeMap['Virginia'] = "$34,052";
		regionPerCapitaIncomeMap['Washington'] = "$31,841";
		regionPerCapitaIncomeMap['West Virginia'] = "$22,714";
		regionPerCapitaIncomeMap['Wisconsin'] = "$28,213";
		regionPerCapitaIncomeMap['Wyoming'] = "$29,698";

		regionPerCapitaIncomeMap['District of Columbia'] = "$45,877";
		regionPerCapitaIncomeMap['Puerto Rico'] = "$11,241";

		regionPerCapitaIncomeMap['United States'] = "$28,889";


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
				$scope.regionPerCapitaIncome = regionPerCapitaIncomeMap[region];

				subscriberMgmt.getRegionCities(region).then(function(regionCities) {
					var sortedRegionCities = {};
					$.map(regionCities,function(e,i) {
						sortedRegionCities[e.city] = (sortedRegionCities[e.city] || 0) + 1;
					});

					var sortable = [];
					for(var city in sortedRegionCities) {
						sortable.push([city, sortedRegionCities[city]]);
					}

					sortable.sort(function(a, b) {
						return a[1] - b[1];
					});

					$scope.regionCities = sortable.reverse();
				});
			});
		}

		$scope.hideRegion = function() {
			$scope.showRegionDetails = false;
		}

	}

}());
