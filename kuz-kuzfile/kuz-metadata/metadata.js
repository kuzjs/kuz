// metadata.js



const fsutils = require("../../kuz-fs");

const separators = [];

function KuzMetaData (kuz, path) {
	this.kuz = kuz;
	this.path = path;
	this.log = this.kuz.log;
	this.setup();
}

KuzMetaData.prototype.setup = function () {
	this.properties = [];
	this.sections = {};
	if (this.exists()) {
		let metaLines = this.kuz.getMetaLines();

		const KuzSections = require("../kuz-sections");
		let kuzSections = new KuzSections(metaLines);

		const Property = require("./property");
		for (let section of kuzSections.sections) {
			if (this.sections[section.name] === undefined) {
				this.sections[section.name] = {};
				this.sections[section.name].mods = section.mods;
			}

			for (let line of section.lines) {
				let lineNumber = line[0];
				let lineText = line[1];
				let property = new Property(lineText);
				if (property.ok()) {
					if (this.sections[section.name][property.name] === undefined) {
						this.sections[section.name][property.name] = property.value;
					} else {
						this.log.red(`Multiple definitions on L${lineNumber}: [${property.name}]`);
					}
				} else {
					this.log.red(`Bad property on L${lineNumber}: [${lineText}]`);
				}
			}
		}
	} else {
		//
	}
}



KuzMetaData.prototype.getProps = function () {
	if (this.sections.main) {
		return this.sections.main;
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
	if (this.sections.main[propertyName] === undefined) {
		return {
			found: false
		};
	} else {
		return {
			found: true,
			value: this.sections.main[propertyName]
		};
	}
}

KuzMetaData.prototype.numberOfProperties = function () {
	return this.properties.length;
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


