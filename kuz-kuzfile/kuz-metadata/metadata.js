// metadata.js



const fsutils = require("../../kuz-fsutils");

function KuzMetaData (kuz) {
	this.kuz = kuz;
	this.path = this.kuz.path;
	this.log = this.kuz.log;
	this.setup();
}

KuzMetaData.prototype.setup = function () {
	//
}

KuzMetaData.prototype.getSections = function () {
	let sections = {};

	let metaLines = this.kuz.getMetaLines();

	const KuzSections = require("../kuz-sections");
	let kuzSections = new KuzSections(metaLines);

	const KuzMetaSection = require("./metasection");
	for (let section of kuzSections.sections) {
		if (sections[section.name] === undefined) {
			sections[section.name] = new KuzMetaSection(this.kuz, section);
		}
	}
	return sections;
}



module.exports = KuzMetaData;


