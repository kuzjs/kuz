// entity.js

const Renderable = require("./renderable").Renderable;
const MetaData = require("../metadata/metadata").MetaData;

function Entity () {
	//
}

Entity.prototype = new Renderable();
Entity.prototype.typename = "entity";
Entity.prototype.typenamePlural = "entities";

Entity.prototype.SetupEntity = function () {
	this.metaData = new MetaData(this.site, this.InputFilePath());
}

Entity.prototype.OutputDirectoryPartialPath = function () {
	return this.site.GetSpecialDirectory() + "/" + this.typename + "/" + this.name;
}

Entity.prototype.IsEntity = function () {
	return true;
}

module.exports = {
	Entity: Entity
};


