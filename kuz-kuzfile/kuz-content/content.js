// content.js



const fsutils = require("../../kuz-fs");

function KuzContent (kuz, path) {
	this.kuz = kuz;
	this.path = path;
	this.log = this.kuz.log;
	this.setup();
}

KuzContent.prototype.setup = function () {
	this.sections = {};
	if (this.exists()) {
		//
	}
}

KuzContent.prototype.exists = function () {
	if (fsutils.IsFile(this.path)) {
		return true;
	}
	return false;
}



module.exports = KuzContent;


