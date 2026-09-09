module.exports = async function (uriConnect) {\n\turiConnect = process.env.MONGODB_URI || uriConnect;\n\tif (!uriConnect || uriConnect === "your_mongodb-uri" || uriConnect === "YOUR_MONGODB_URI")\n\t\tthrow new Error("MongoDB URI is not configured. Set database.uriMongodb or MONGODB_URI.");
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