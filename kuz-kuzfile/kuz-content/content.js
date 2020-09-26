// content.js



const fsutils = require("../../kuz-fs");

function KuzContent (kuz) {
	this.kuz = kuz;
	this.path = this.kuz.path;
	this.log = this.kuz.log;
	this.setup();
}

KuzContent.prototype.setup = function () {
	//
}

KuzContent.prototype.exists = function () {
	if (fsutils.IsFile(this.path)) {
		return true;
	}
	return false;
}

KuzContent.prototype.getSections = function () {
	let sections = {};
	if (this.exists()) {
		let contentLines = this.kuz.getContentLines();

		const KuzSections = require("../kuz-sections");
		let kuzSections = new KuzSections(contentLines);

		const KuzContentSection = require("./contentsection")

		for (let section of kuzSections.sections) {
			if (sections[section.name] === undefined) {
				sections[section.name] = new KuzContentSection(this.kuz, section);
			}
		}
	}

	return sections;
}



module.exports = KuzContent;


