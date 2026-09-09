module.exports = async function (uriConnect) {
	uriConnect = process.env.MONGODB_URI || uriConnect;
	if (!uriConnect || uriConnect === "your_mongodb-uri" || uriConnect === "YOUR_MONGODB_URI")
		throw new Error("MongoDB URI is not configured. Set database.uriMongodb or MONGODB_URI.");
	const mongoose = require("mongoose");

	const threadModel = require("../models/mongodb/thread.js");
	const userModel = require("../models/mongodb/user.js");
	const dashBoardModel = require("../models/mongodb/userDashBoard.js");
	const globalModel = require("../models/mongodb/global.js");

	await mongoose.connect(uriConnect, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	});

	return {
		threadModel,
		userModel,
		dashBoardModel,
		globalModel
	};
};