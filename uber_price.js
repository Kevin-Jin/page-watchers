// Pick-up and destination locations must be chosen first before running this script.

max_price = 40;
target_tier = "UberX";
poll_period_ms = 100;

document.getElementsByTagName("body")[0].innerHTML = "<iframe id=\"uber_price_watcher\" src=\"" + window.location.toString() + "\" style=\"position: absolute; top: 0; left: 0; right: 0; bottom: 0; width: 100%; height: 100%; border-width: 0;\"></iframe>";
is_refreshing = false;
var timer = setInterval(function() {
	var tiers = Array.prototype.slice.call(document.getElementById("uber_price_watcher").contentDocument.querySelectorAll("[data-test=\"vehicle-view-container\"]"));
	tiers = tiers.map(function(tier) { return Array.prototype.slice.call(tier.getElementsByTagName("span")).map(function(x) { return x.innerHTML; }); });
	tiers = tiers.filter(function(tier) { return tier.includes(target_tier); });
	if (tiers.length != 1) {
		// Page hasn't finished loading.
		is_refreshing = false;
		return;
	}
	if (is_refreshing) {
		// Page hasn't start loading.
		return;
	}
	prices = tiers[0].map(function(txt) { return txt.match(/\$\d+\.\d+/); }).filter(function(txt) { return txt; });
	if (prices.length != 1) {
		throw "Non-unique price";
	}
	price = Number(prices[0][0].substring(1));
	console.log("[" + new Date().toISOString() + "] Price: " + price);
	if (price > max_price) {
		// Refresh fare.
		document.getElementById("uber_price_watcher").src = document.getElementById("uber_price_watcher").src;
		is_refreshing = true;
	} else {
		// Stop refreshing fare and give the user a chance to request the ride.
		alert("Found satisfactory price");
		clearInterval(timer);
	}
}, poll_period_ms);

function stop() {
	clearInterval(timer);
}
