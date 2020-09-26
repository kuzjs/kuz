// window.js



function KursesWindow (instance, title) {
	this.instance = instance;
	this.title = title;
	this.created_time = process.hrtime.bigint();
}

KursesWindow.prototype.setTitle = function (title) {
	this.title = title;
	return this;
}

KursesWindow.prototype.getTitle = function () {
	return this.title;
}



module.exports = KursesWindow;


