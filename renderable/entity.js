// entity.js



function Entity () {
	//
}

const Renderable = require("./renderable").Renderable;
Entity.prototype = new Renderable();
Entity.prototype.typeName = "entity";
Entity.prototype.typeNamePlural = "entities";
Entity.prototype.codeLetter = "e";

Entity.prototype.SetupEntity = function (site, configFileObject, entry) {
	this.SetSite(site);
	this.SetConfig(configFileObject);
	this.name = entry.trim();

	const MetaData = require("../metadata/metadata").MetaData;
	this.metaData = new MetaData(this.site, this.InputFilePath());
}

Entity.prototype.OutputDirectoryPartialPath = function () {
	return this.site.GetSpecialDirectory() + "/" + this.typeName + "/" + this.name;
}

Entity.prototype.IsEntity = function () {
	return true;
}

module.exports = {
	Entity: Entity
};


