// A record of every game from which to build the tables.
var games = [
	{ home: "Ryan", away: "Kevin", homeScore: 3, awayScore: 2, date: "07/19/2019" },
	{ home: "Ryan", away: "Kevin", homeScore: 4, awayScore: 7, date: "07/19/2019" },
	{ home: "Kevin", away: "Ryan", homeScore: 5, awayScore: 3, date: "07/19/2019" },
];

// A list of players with their wins and losses.
var winsLosses = [];
// A map of player names to index in winsLosses.
var nameIdxs = {};

// winsLosses with zeroed data and setup nameIdxs.
for (var i = 0; i < games.length; i++) {
	if (nameIdxs[games[i].home] == undefined) {
		winsLosses.push({ name: games[i].home, wins: 0, losses: 0 });
		nameIdxs[games[i].home] = winsLosses.length - 1;
	}
	if (nameIdxs[games[i].away] == undefined) {
		winsLosses.push({ name: games[i].away, wins: 0, losses: 0 });
		nameIdxs[games[i].away] = winsLosses.length - 1;
	}
}

// Tally wins and losses.
for (var i = 0; i < games.length; i++) {
	var gm = games[i];
	if (gm.homeScore > gm.awayScore) {
		winsLosses[nameIdxs[gm.home]].wins++;
		winsLosses[nameIdxs[gm.away]].losses++;
	} else {
		winsLosses[nameIdxs[gm.away]].wins++;
		winsLosses[nameIdxs[gm.home]].losses++;
	}
}

// Sort by overall record (games behind).
winsLosses.sort(function (record1, record2) {
	var overall1 = record1.wins - record1.losses;
	var overall2 = record2.wins - record2.losses;
	return overall2 - overall1;
});

// Populate the schedule.
var schedTable = document.getElementById("schedule");
for (var i = 0; i < games.length; i++) {
	var home = document.createElement("td");
	var away = document.createElement("td");
	var score = document.createElement("td");
	var date = document.createElement("td");

	var gm = games[i];
	var scoreStr = gm.awayScore.toString() + " - " + gm.homeScore.toString()
	away.appendChild(document.createTextNode(gm.away));
	home.appendChild(document.createTextNode(gm.home));
	score.appendChild(document.createTextNode(scoreStr));
	date.appendChild(document.createTextNode(gm.date));

	var row = document.createElement("tr");
	row.appendChild(away);
	row.appendChild(home);
	row.appendChild(score);
	row.appendChild(date);
	schedTable.appendChild(row);
}

// Populate the wins/losses.
var recordsTable = document.getElementById("records");
for (var i = 0; i < winsLosses.length; i++) {
	var player = document.createElement("td");
	var wins = document.createElement("td");
	var losses = document.createElement("td");
	var gb = document.createElement("td");

	var wl = winsLosses[i];
	var gbNum = ((winsLosses[0].wins - wl.wins) + (wl.losses - winsLosses[0].losses)) / 2;
	player.appendChild(document.createTextNode(wl.name));
	wins.appendChild(document.createTextNode(wl.wins));
	losses.appendChild(document.createTextNode(wl.losses));
	gb.appendChild(document.createTextNode(gbNum.toString()));

	var row = document.createElement("tr");
	row.appendChild(player);
	row.appendChild(wins);
	row.appendChild(losses);
	row.appendChild(gb);
	recordsTable.appendChild(row);
}
