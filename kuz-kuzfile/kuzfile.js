


function KuzFile (owner, path) {
	this.owner = owner;
	this.path = path;
	this.log = this.owner.log;

	const KuzMetaData = require("../kuz-metadata").KuzMetaData;
	this.metaData = new KuzMetaData(this, this.path);
}

KuzFile.prototype.getMetaData = function () {
	return this.metaData;
}



module.exports = {
	KuzFile: KuzFile
};


