


function KuzFile (owner, path) {
	this.owner = owner;
	this.path = path;
	this.log = this.owner.log;

	const KuzRegionFile = require("./regionfile").KuzRegionFile;
	this.regions = new KuzRegionFile(this.path);

	const KuzMetaData = require("../kuz-metadata").KuzMetaData;
	this.metaData = new KuzMetaData(this, this.path);
}

KuzFile.prototype.getMetaData = function () {
	return this.metaData;
}

KuzFile.prototype.getNss = function () {
	return this.regions;
}



module.exports = {
	KuzFile: KuzFile
};


