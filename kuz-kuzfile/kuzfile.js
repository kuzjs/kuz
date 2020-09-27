// kuzfile.js



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



KuzFile.prototype.getCodeFiles = function () {
	return [];
}

KuzFile.prototype.getJsons = function () {
	return [];
	if (this.cacheIsOn()) {
		if (this.jsons === undefined) {
			this.jsons = this.metaData.getJsons()
			return this.jsons;
		} else {
			return this.jsons;
		}
	} else {
		return this.metaData.getJsons();
	}
}

KuzFile.prototype.getKuzs = function () {
	return [];
}

KuzFile.prototype.getReqs = function () {
	return [];
}



KuzFile.prototype.getMetaData = function () {
	return this.metaData;
}

KuzFile.prototype.getRegions = function () {
	return this.regions;
}

KuzFile.prototype.getMetaLines = function () {
	return this.regions.getMetaLines();
}

KuzFile.prototype.getContentLines = function () {
	return this.regions.getContentLines();
}



module.exports = KuzFile;


