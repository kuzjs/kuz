


function KuzFile (owner, path) {
	this.owner = owner;
	this.path = path;
	this.log = this.owner.log;
	this.cache = false;

	const KuzRegions = require("./kuz-regions").KuzRegions;
	this.regions = new KuzRegions(this.path);

	const KuzMetaData = require("./kuz-metadata").KuzMetaData;
	this.metaData = new KuzMetaData(this, this.path);
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

KuzFile.prototype.getBodyString = function () {
	return this.regions.getBodyString();
}



module.exports = {
	KuzFile: KuzFile
};


