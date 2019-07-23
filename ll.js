// A list of players with their wins and losses.
var winsLosses = [];
// A map of player names to index in winsLosses.
var nameIdxs = {};

// Initialize winsLosses and setup nameIdxs.
for (var i = 0; i < games.length; i++) {
	if (nameIdxs[games[i].home] == undefined) {
		winsLosses.push({ name: games[i].home, wins: 0, losses: 0, gamesPlayed: 0, runsScored: 0, runsAllowed: 0 });
		nameIdxs[games[i].home] = winsLosses.length - 1;
	}
	if (nameIdxs[games[i].away] == undefined) {
		winsLosses.push({ name: games[i].away, wins: 0, losses: 0, gamesPlayed: 0, runsScored: 0, runsAllowed: 0 });
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
	winsLosses[nameIdxs[gm.home]].gamesPlayed++;
	winsLosses[nameIdxs[gm.away]].gamesPlayed++;
	winsLosses[nameIdxs[gm.home]].runsScored += gm.homeScore;
	winsLosses[nameIdxs[gm.away]].runsScored += gm.awayScore;
	winsLosses[nameIdxs[gm.home]].runsAllowed += gm.awayScore;
	winsLosses[nameIdxs[gm.away]].runsAllowed += gm.homeScore;
}

// Sort by overall record (games behind).
winsLosses.sort(function (record1, record2) {
	var overall1 = record1.wins - record1.losses;
	var overall2 = record2.wins - record2.losses;
	if (overall1 != overall2) {
		return overall2 - overall1;
	}

	var pct1 = record1.wins / (record1.wins + record1.losses);
	var pct2 = record2.wins / (record2.wins + record2.losses);
	return pct2 - pct1;
});

// Populate the schedule.
var schedTable = document.getElementById("schedule");
for (var i = 0; i < games.length; i++) {
	var home = document.createElement("td");
	var away = document.createElement("td");
	var score = document.createElement("td");
	var date = document.createElement("td");
	var freakouts = document.createElement("td");
	freakouts.classList.add("bigface-text");

	var gm = games[i];
	var scoreStr = gm.awayScore.toString() + " - " + gm.homeScore.toString()
	away.appendChild(document.createTextNode(gm.away));
	home.appendChild(document.createTextNode(gm.home));
	score.appendChild(document.createTextNode(scoreStr));
	date.appendChild(document.createTextNode(gm.date));
	freakouts.appendChild(document.createTextNode(gm.freakouts));

	if (gm.homeScore > gm.awayScore) {
		home.classList.add("winner");
	} else {
		away.classList.add("winner");
	}

	var row = document.createElement("tr");
	row.appendChild(away);
	row.appendChild(home);
	row.appendChild(score);
	row.appendChild(date);
	row.appendChild(freakouts);
	schedTable.appendChild(row);
}

// Populate the wins/losses.
var recordsTable = document.getElementById("records");
for (var i = 0; i < winsLosses.length; i++) {
	var player = document.createElement("td");
	player.classList.add("player");
	var gamesPlayed = document.createElement("td");
	var wins = document.createElement("td");
	var losses = document.createElement("td");
	var pct = document.createElement("td");
	var gb = document.createElement("td");
	var runsScored = document.createElement("td");
	var runsAllowed = document.createElement("td");

	var wl = winsLosses[i];
	var gbNum = ((winsLosses[0].wins - wl.wins) + (wl.losses - winsLosses[0].losses)) / 2;
	var runsScoredPerGame = wl.runsScored / wl.gamesPlayed;
	var runsAllowedPerGame = wl.runsAllowed / wl.gamesPlayed;
	var pctNum = wl.wins / (wl.wins + wl.losses);

	player.appendChild(document.createTextNode(wl.name));
	gamesPlayed.appendChild(document.createTextNode(wl.gamesPlayed));
	wins.appendChild(document.createTextNode(wl.wins));
	losses.appendChild(document.createTextNode(wl.losses));
	pct.appendChild(document.createTextNode(pctNum.toFixed(3)));
	gb.appendChild(document.createTextNode(gbNum.toString()));
	runsScored.appendChild(document.createTextNode(runsScoredPerGame.toFixed(2)));
	runsAllowed.appendChild(document.createTextNode(runsAllowedPerGame.toFixed(2)));

	var row = document.createElement("tr");
	row.appendChild(player);
	row.appendChild(gamesPlayed);
	row.appendChild(wins);
	row.appendChild(losses);
	row.appendChild(pct);
	row.appendChild(gb);
	row.appendChild(runsScored);
	row.appendChild(runsAllowed);
	recordsTable.appendChild(row);
}

// MARQUEEEEEE
document.getElementById("bigface").onclick = function() {
	var danya = document.createElement("img");
	danya.setAttribute("src", "./danya.jpg");
	var marq = document.createElement("marquee");
	marq.appendChild(danya);
	marq.setAttribute("scrollamount", "40");
	var body = document.getElementsByTagName("body")[0];
	body.prepend(marq);
};
