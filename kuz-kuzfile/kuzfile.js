// kuzfile.js

const fs = require("fs");
const path = require("path");



function KuzFile (owner, path) {
	this.owner = owner;
	this.path = path;
	this.log = this.owner.log;
	this.cache = false;

	const KuzRegions = require("./kuz-regions");
	this.regions = new KuzRegions(this.path);

	const KuzMetaData = require("./kuz-metadata");
	this.metaData = new KuzMetaData(this);
	this.metaSections = this.metaData.getSections();

	const KuzContent = require("./kuz-content");
	this.content = new KuzContent(this);
}



KuzFile.prototype.getMetaSections = function () {
	return this.metaData.getSections();
}

KuzFile.prototype.getContentSections = function () {
	return this.content.getSections();
}



KuzFile.prototype.turnCacheOn = function () {
	this.cache = true;
	return this;
}

KuzFile.prototype.turnCacheOff = function () {
	this.cache = false;
	return this;
}

KuzFile.prototype.cacheIsOn = function () {
	return this.cache;
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



KuzFile.prototype.getCodeFiles = function () {
	return [];
}

KuzFile.prototype.getJsons = function () {
	let jsons = {};
	if (this.metaSections.json) {
		for (let jsonName in this.metaSections.json.props) {
			let jsonPath = this.metaSections.json.props[jsonName];
			let jsonFullPath = this.getFilePath(jsonPath);
			console.log(jsonFullPath);
			try {
				let json = JSON.parse(fs.readFileSync(jsonFullPath));
				jsons[jsonName] = json;
			} catch {
				//
			}
		}
	}
	return jsons;
}

KuzFile.prototype.getKuzs = function () {
	return [];
}

KuzFile.prototype.getReqs = function () {
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


