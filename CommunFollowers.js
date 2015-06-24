var Twit = require('twit');
var Config = require('./config.js');

var T = new Twit(Config.twitterOauthKeys);

var account1 = process.argv[2];
var account2 = process.argv[3];

T.get('followers/ids', { screen_name: account1},  function (err, data, response) {
	if(err) {
		console.log("\x1b[0;31m" + '[TWITTER ERROR] ' + "\x1b[37m" + err);
		return;
	}

	var followersIds1 = data.ids;

	T.get('followers/ids', { screen_name: account2},  function (err, data2, response) {
		if(err) {
			console.log("\x1b[0;31m" + '[TWITTER ERROR] ' + "\x1b[37m" + err);
			return;
		}

		var followersIds2 = data2.ids;

		compare(followersIds1, followersIds2);
	});
});

function compare(ids1, ids2) {
	var nbFollow = {
		1: ids1.length, 
		2: ids2.length
	}

	ids1 = ids1.filter(function(e) {
		return ids2.indexOf(e) > -1
	});

	var communFollowers = ids2.filter(function(e) {
		return ids1.indexOf(e) > -1
	});

	console.log('Followers en commun entre ' + "\x1b[36m" + '@' + account1 + "\x1b[0;33m" + ' (' + nbFollow[1] + ')' + "\x1b[37m" + ' et ' + "\x1b[36m" + '@' + account2 + "\x1b[0;33m" + ' (' + nbFollow[2] + ')' + "\x1b[37m" + ' : ' + communFollowers.length);

	getFollowersName(communFollowers);
}

function getFollowersName(ids) {
	var nbPage = Math.ceil(ids.length/100);

	for(var i = 0; i < nbPage; i++) {
		T.get('users/lookup', { user_id: ids.slice(100*i, 100*(i+1)).join()},  function (err, data, response) {
			if(err) {
				console.log("\x1b[0;31m" + '[TWITTER ERROR] ' + "\x1b[37m" + err);
				return;
			}

			returnData(data);
		});
	}
}

function returnData(users) {
	var screen_nameList = [];

	for(key in users) {
		var user = users[key];

		screen_nameList.push(user.screen_name);
	}

	console.log(screen_nameList.join(', '));
}