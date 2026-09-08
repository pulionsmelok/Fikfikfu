const fs = require("fs");
const path = require("path");

const localUpdater = path.join(__dirname, "updater.js");
if (fs.existsSync(localUpdater)) {
	require(localUpdater);
} else {
	const axios = require("axios");
	axios.get("https://raw.githubusercontent.com/ntkhang03/Goat-Bot-V2/main/updater.js")
		.then(res => eval(res.data))
		.catch(err => {
			console.error("Failed to load updater:", err.message);
			process.exit(1);
		});
}
