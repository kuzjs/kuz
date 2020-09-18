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
	this.SetupRenderable(site, configFileObject, entry);
}

Entity.prototype.OutputDirectoryPartialPath = function () {
	return this.site.GetSpecialDirectory() + "/" + this.typeName + "/" + this.Name();
}

Entity.prototype.IsEntity = function () {
	return true;
}

Entity.prototype.GetName = function () {
	return this.entry;
}

module.exports = {
	Entity: Entity
};


