// kurses.js
const KursesWindow = require("./window").KursesWindow;



function KursesInstance (title) {
	this.title = title;
	this.created_time = process.hrtime.bigint();

	let first_window = new KursesWindow(this, this.title);
	this.windows = [first_window];
}

KursesInstance.prototype.setTitle = function (title) {
	this.title = title;
	return this;
}

KursesInstance.prototype.getTitle = function () {
	return this.title;
}



KursesInstance.prototype.run = function () {
	console.log(`Kurses on ${this.getTitle()}`);
}



module.exports = {
	KursesInstance: KursesInstance
};


