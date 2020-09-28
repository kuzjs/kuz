// kuzfile.js

const fs = require("fs");
const path = require("path");

const fsutils = require("../kuz-fsutils");



function KuzFile (owner, path) {
	this.owner = owner;
	this.path = path;
	this.log = this.owner.log;
	this.hasCache = false;
	this.cache = {};

	if (this.exists()) {
		this.setup();
	}
}

KuzFile.prototype.setup = function () {
	const KuzRegions = require("./kuz-regions");
	this.regions = new KuzRegions(this.path);

	const KuzMetaData = require("./kuz-metadata");
	this.metaData = new KuzMetaData(this);
	this.metaSections = this.metaData.getSections();

	const KuzContent = require("./kuz-content");
	this.content = new KuzContent(this);
}

KuzFile.prototype.exists = function () {
	if (fsutils.isFile(this.path)) {
		return true;
	}
	return false;
}

KuzFile.prototype.ok = function () {
	if (!this.exists()) {
		return false;
	}
	return true;
}



KuzFile.prototype.getMetaSections = function () {
	return this.metaData.getSections();
}

KuzFile.prototype.getContentSections = function () {
	return this.content.getSections();
}



KuzFile.prototype.turnCacheOn = function () {
	this.hasCache = true;
	return this;
}

KuzFile.prototype.turnCacheOff = function () {
	this.hasCache = false;
	return this;
}

KuzFile.prototype.cacheIsOn = function () {
	return this.hasCache;
}

KuzFile.prototype.cacheIsOff = function () {
	return !this.cacheIsOn();
}



KuzFile.prototype.getProps = function () {
	return this.metaSections.main.props;
}

KuzFile.prototype.getProperty = function (propertyName) {
	if (this.metaSections.main.props[propertyName] === undefined) {
		return {
			found: false
		};
	} else {
		return {
			found: true,
			value: this.metaSections.main.props[propertyName]
		};
	}
}



KuzFile.prototype.getFilePath = function (fileName) {
	return path.join(path.dirname(this.path), fileName);
}



KuzFile.prototype.getCachedItems = function () {
	return {
		props: this.getProps(),

		codes: this.getCodeFiles(),
		jsons: this.getJsons(),
		kuzs: this.getKuzs(),
		reqs: this.getReqs(),

		csss: this.getCsss(),
		jss: this.getJss(),

		csvs: this.getCsvs(),
		tables: this.getTables(),

		tomls: this.getTomls(),
		yamls: this.getYamls(),

		zzz: false
	};
}



KuzFile.prototype.getCodeFiles = function () {
	if (this.cacheIsOn() && this.cache.codes) {
		return this.cache.codes;
	}

	let codes = {};
	if (this.metaSections.code) {
		const KuzCodeFile = require("../kuz-codefile")
		for (let codeName in this.metaSections.code.props) {
			let codePath = this.metaSections.code.props[codeName];
			let codeFullPath = this.getFilePath(codePath);
			let code = new KuzCodeFile(this, codeFullPath);
			if (code.ok()) {
				codes[codeName] = code;
			}
		}
	}

	if (this.cacheIsOn()) {
		this.cache.codes = codes;
	}
	return codes;
}

KuzFile.prototype.getJsons = function () {
	if (this.cacheIsOn() && this.cache.jsons) {
		return this.cache.jsons;
	}

	let jsons = {};
	if (this.metaSections.json) {
		for (let jsonName in this.metaSections.json.props) {
			let jsonPath = this.metaSections.json.props[jsonName];
			let jsonFullPath = this.getFilePath(jsonPath);
			try {
				let json = JSON.parse(fs.readFileSync(jsonFullPath));
				jsons[jsonName] = json;
			} catch {
				//
			}
		}
	}

	if (this.cacheIsOn()) {
		this.cache.jsons = jsons;
	}
	return jsons;
}

KuzFile.prototype.getKuzs = function () {
	if (this.cacheIsOn() && this.cache.kuzs) {
		return this.cache.kuzs;
	}

	let kuzs = {};
	if (this.metaSections.kuz) {
		for (let kuzName in this.metaSections.kuz.props) {
			let kuzPath = this.metaSections.kuz.props[kuzName];
			let kuzFullPath = this.getFilePath(kuzPath);
			let kuz = new KuzFile(this, kuzFullPath);
			if (kuz.ok()) {
				kuzs[kuzName] = kuz;
			}
		}
	}

	if (this.cacheIsOn()) {
		this.cache.kuzs = kuzs;
	}
	return kuzs;
}

KuzFile.prototype.getReqs = function () {
	return [];
}



KuzFile.prototype.getCsss = function () {
	return [];
}

KuzFile.prototype.getJss = function () {
	return [];
}



KuzFile.prototype.getCsvs = function () {
	return [];
}

KuzFile.prototype.getTables = function () {
	return [];
}



KuzFile.prototype.getTomls = function () {
	return [];
}

KuzFile.prototype.getYamls = function () {
	return [];
}



KuzFile.prototype.getMetaLines = function () {
	return this.regions.getMetaLines();
}

KuzFile.prototype.getContentLines = function () {
	return this.regions.getContentLines();
}



KuzFile.prototype.numberOfProperties = function () {
	return 0;
}



KuzFile.prototype.printMetaSectionsTable = function () {
	const KuzTable = require("../kuz-table");
	let table = new KuzTable();
	table.addColumn("Section");
	table.addColumn("Name");
	table.addColumn("Value");

	let sectionIndex = 0;
	for (let sectionName in this.metaSections) {
		if (sectionIndex > 0) {
			table.addSeparatorRow();
		}
		let section = this.metaSections[sectionName];
		let propIndex = 0;
		for (let propName in section.props) {
			if (propIndex === 0) {
				table.addRow([sectionName, propName, section.props[propName]]);
			} else {
				table.addRow(["", propName, section.props[propName]]);
			}
			propIndex++;
		}
		sectionIndex++;
	}
	table.print()
}

KuzFile.prototype.printContentSectionsTable = function () {
	const contentSections = this.getContentSections();

	const KuzTable = require("../kuz-table");
	let table = new KuzTable();
	table.addColumn("Name");
	table.addColumn("Mods");
	table.addColumn("Heading");

	let sectionIndex = 0;
	for (let sectionName in contentSections) {
		let section = contentSections[sectionName];
		table.addRow([
			section.getName(),
			section.getMods(),
			section.getHeading()
		]);
		sectionIndex++;
	}
	table.print()
}



module.exports = KuzFile;


