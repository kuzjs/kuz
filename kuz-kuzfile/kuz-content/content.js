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
		let contentLines = this.kuz.getContentLines();

		const KuzSections = require("../kuz-sections");
		let kuzSections = new KuzSections(contentLines);
		for (let section of kuzSections.sections) {
			//this.log.green("Section found: " + section.name);
		}
	}
}

KuzContent.prototype.exists = function () {
	if (fsutils.IsFile(this.path)) {
		return true;
	}
	return false;
}



module.exports = KuzContent;


