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
		reqs: this.getReqs()
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



module.exports = KuzFile;


