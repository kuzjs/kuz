// metadata.js



const fsutils = require("../../kuz-fs");

function KuzMetaData (kuz) {
	this.kuz = kuz;
	this.path = this.kuz.path;
	this.log = this.kuz.log;
	this.setup();
}

KuzMetaData.prototype.setup = function () {
	this.sections = {};

	let metaLines = this.kuz.getMetaLines();

	const KuzSections = require("../kuz-sections");
	let kuzSections = new KuzSections(metaLines);

	const KuzMetaSection = require("./metasection");
	for (let section of kuzSections.sections) {
		if (this.sections[section.name] === undefined) {
			this.sections[section.name] = new KuzMetaSection(this.kuz, section);
		}
	}
}



KuzMetaData.prototype.getSections = function () {
	return this.sections;
}



KuzMetaData.prototype.getProps = function () {
	if (this.sections.main) {
		return this.sections.main.props;
	}
	return {};
}



KuzMetaData.prototype.getCodeFiles = function () {
	if (this.sections.code) {
		return this.sections.code;
	}
	return {};
}

KuzMetaData.prototype.getJsons = function () {
	if (this.sections.json) {
		return this.sections.json;
	}
	return {};
}

KuzMetaData.prototype.getKuzs = function () {
	if (this.sections.kuz) {
		return this.sections.kuz;
	}
	return {};
}

KuzMetaData.prototype.getReqs = function () {
	let reqs = {};
	if (this.sections.reqs) {
		for (let key in this.sections.reqs) {
			try {
				let modName = this.sections.reqs[key];
				reqs[key] = require(modName);
			} catch (c) {
				reqs[key] = null;
			}
		}
	}
	return reqs;
}



KuzMetaData.prototype.exists = function () {
	if (fsutils.IsFile(this.path)) {
		return true;
	}
	return false;
}

KuzMetaData.prototype.getValue = function (propertyName) {
	if (this.sections.main.props[propertyName] === undefined) {
		return {
			found: false
		};
	} else {
		return {
			found: true,
			value: this.sections.main.props[propertyName]
		};
	}
}

KuzMetaData.prototype.printPropertyTable = function () {
	for (let sectionName in this.sections) {
		let section = this.sections[sectionName];
		console.log(`[${sectionName}]`);
		for (let key in section) {
			console.log(`\t${key}: ${section[key]}`);
		}
	}
}

module.exports = KuzMetaData;


