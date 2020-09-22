


function KuzFile (owner, path) {
	this.owner = owner;
	this.path = path;
	this.log = this.owner.log;

	const KuzRegions = require("./regions").KuzRegions;
	this.regions = new KuzRegions(this.path);

	const KuzMetaData = require("./kuz-metadata").KuzMetaData;
	this.metaData = new KuzMetaData(this, this.path);
}

KuzFile.prototype.getMetaData = function () {
	return this.metaData;
}

KuzFile.prototype.getNss = function () {
	return this.regions;
}

KuzFile.prototype.getContentLines = function () {
	return this.regions.getContentLines();
}



module.exports = {
	KuzFile: KuzFile
};


