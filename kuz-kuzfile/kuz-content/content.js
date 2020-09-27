// content.js



const fsutils = require("../../kuz-fsutils");

function KuzContent (kuz) {
	this.kuz = kuz;
	this.setup();
}

KuzContent.prototype.setup = function () {
	//
}

KuzContent.prototype.getSections = function () {
	const contentLines = this.kuz.getContentLines();

	const KuzSections = require("../kuz-sections");
	const kuzSections = new KuzSections(contentLines);

	const KuzContentSection = require("./contentsection")

	const sections = {};
	for (let section of kuzSections.sections) {
		if (sections[section.name] === undefined) {
			sections[section.name] = new KuzContentSection(this.kuz, section);
		}
	}

	return sections;
}



module.exports = KuzContent;


