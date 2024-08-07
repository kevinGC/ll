// Matt doesn't want to count all the stats -- blame him for this.
const skipPlayers = ["Danya"];
const skipName = "skip";

// Maps player name to whether they are active in the standings table.
var activePlayers = {};
for (var i = 0; i < games.length; i++) {
	activePlayers[games[i].home] = true;
	activePlayers[games[i].away] = true;
}

// Tally wins and losses.
var tally = function() {
	var stats = {};
	stats[skipName] = { wins: 0, losses: 0, pointsScored: 0, pointsAllowed: 0 };
	for (var i = 0; i < games.length; i++) {
		stats[games[i].home] = { wins: 0, losses: 0, ties: 0, pointsScored: 0, pointsAllowed: 0 };
		stats[games[i].away] = { wins: 0, losses: 0, ties: 0, pointsScored: 0, pointsAllowed: 0 };
	}

	for (var i = 0; i < games.length; i++) {
		var gm = games[i];

		// Should we skip this game?
		if (!activePlayers[gm.home] || !activePlayers[gm.away]) {
			continue;
		}

		var home = gm.home;
		var away = gm.away;
		if (skipPlayers.includes(home)) {
			away = skipName;
		} else if (skipPlayers.includes(away)) {
			home = skipName;
		}

		if (gm.homeScore > gm.awayScore) {
			stats[home].wins++;
			stats[away].losses++;
		} else if (gm.awayScore > gm.homeScore) {
			stats[away].wins++;
			stats[home].losses++;
		} else {
			// Tie game.
			stats[away].ties++;
			stats[home].ties++;
		}
		stats[home].pointsScored += gm.homeScore;
		stats[away].pointsScored += gm.awayScore;
		stats[home].pointsAllowed += gm.awayScore;
		stats[away].pointsAllowed += gm.homeScore;
	}

	delete stats[skipName];

	var entries = Object.entries(stats);

	// Sort by overall record (games behind).
	entries.sort(function (entry1, entry2) {
		if (!activePlayers[entry1[0]] && activePlayers[entry2[0]]) {
			return 1;
		} else if (activePlayers[entry1[0]] && !activePlayers[entry2[0]]) {
			return -1;
		}

		var record1 = entry1[1];
		var record2 = entry2[1];

		var pct1 = record1.wins / (record1.wins + record1.losses + record1.ties) || 0;
		var pct2 = record2.wins / (record2.wins + record2.losses + record2.ties) || 0;
		if (pct1 != pct2) {
			return pct2 - pct1;
		}

		var overall1 = record1.wins - record1.losses;
		var overall2 = record2.wins - record2.losses;
		return overall2 - overall1;
	});

	return entries;
};

var draw = function(entries) {
	// Populate the schedule.
	var scheduleRow = document.getElementById("schedule-header").nextSibling;
	while (scheduleRow != null) {
		var tmp = scheduleRow;
		scheduleRow = scheduleRow.nextSibling;
		tmp.parentNode.removeChild(tmp);
	}
	var schedTable = document.getElementById("schedule-body");
	for (var i = 0; i < games.length; i++) {
		// Skip games with inactive players.
		var gm = games[i];
		if (!activePlayers[gm.home] || !activePlayers[gm.away]) {
			continue;
		}

		var home = document.createElement("td");
		var away = document.createElement("td");
		var score = document.createElement("td");
		var date = document.createElement("td");

		var scoreStr = gm.awayScore.toString() + " - " + gm.homeScore.toString()
		away.appendChild(document.createTextNode(gm.away));
		home.appendChild(document.createTextNode(gm.home));
		score.appendChild(document.createTextNode(scoreStr));
		date.appendChild(document.createTextNode(gm.date));

		if (gm.homeScore > gm.awayScore) {
			home.classList.add("winner");
		} else if (gm.awayScore > gm.homeScore) {
			away.classList.add("winner");
		}

		var row = document.createElement("tr");
		row.appendChild(away);
		row.appendChild(home);
		row.appendChild(score);
		row.appendChild(date);
		schedTable.appendChild(row);
	}

	// Populate the wins/losses.
	var recordsRow = document.getElementById("records-header").nextSibling;
	while (recordsRow != null) {
		var tmp = recordsRow;
		recordsRow = recordsRow.nextSibling;
		tmp.parentNode.removeChild(tmp);
	}
	var recordsTable = document.getElementById("records-body");
	for (var i = 0; i < entries.length; i++) {
		var player = document.createElement("td");
		player.classList.add("player");
		var gamesPlayed = document.createElement("td");
		var wins = document.createElement("td");
		var losses = document.createElement("td");
		var ties = document.createElement("td");
		var pct = document.createElement("td");
		var gb = document.createElement("td");
		var pointsScored = document.createElement("td");
		var pointsAllowed = document.createElement("td");

		var wl = entries[i][1];
		var gbNum = ((entries[0][1].wins - wl.wins) + (wl.losses - entries[0][1].losses)) / 2 || 0;
		var pointsScoredPerGame = wl.pointsScored / (wl.wins + wl.losses) || 0;
		var pointsAllowedPerGame = wl.pointsAllowed / (wl.wins + wl.losses) || 0;
		var pctNum = wl.wins / (wl.wins + wl.losses) || 0;

		player.appendChild(document.createTextNode(entries[i][0]));
		gamesPlayed.appendChild(document.createTextNode(wl.wins + wl.losses));
		wins.appendChild(document.createTextNode(wl.wins));
		losses.appendChild(document.createTextNode(wl.losses));
		ties.appendChild(document.createTextNode(wl.ties));
		pct.appendChild(document.createTextNode(pctNum.toFixed(3)));
		gb.appendChild(document.createTextNode(gbNum.toString()));
		pointsScored.appendChild(document.createTextNode(pointsScoredPerGame.toFixed(2)));
		pointsAllowed.appendChild(document.createTextNode(pointsAllowedPerGame.toFixed(2)));

		var row = document.createElement("tr");
		row.appendChild(player);
		row.appendChild(gamesPlayed);
		row.appendChild(wins);
		row.appendChild(losses);
		row.appendChild(ties);
		row.appendChild(pct);
		row.appendChild(gb);
		row.appendChild(pointsScored);
		row.appendChild(pointsAllowed);
		recordsTable.appendChild(row);
	}

	var playerCells = document.getElementsByClassName("player");
	for (var i = 0; i < playerCells.length; i++) {
		var th = playerCells[i];
		for (var td = th.nextSibling; td != null; td = td.nextSibling) {
			if (activePlayers[entries[i][0]]) {
				td.classList.remove("inactive");
			} else {
				td.classList.add("inactive");
			}
		}
	}

	// Head-to-head.
	for (var i = 0; i < playerCells.length; i++) {
		playerCells[i].onclick = function(i, entries) {
			return function () {
				console.log(i);
				activePlayers[entries[i][0]] = !activePlayers[entries[i][0]];

				var numActive = Object.values(activePlayers).reduce((acc, cur) => {
					return acc + (cur ? 1 : 0);
				}, 0);
				console.log("numActive: " + numActive);

				// If nothing is active, set everything to active.
				if (numActive <= 1) {
					for (const key of Object.keys(activePlayers)) {
						activePlayers[key] = true;
					}
				}

				// Re-compute stats with just active players.
				draw(tally());
			}
		}(i, entries);
	}


};

draw(tally());
