// collections.js


const Entity = require("./entity").Entity;

function Collection (site, configFileObject, entry) {
	this.SetupEntity(site, configFileObject, entry);
}

Collection.prototype = new Entity();
Collection.prototype.typeName = "collection";
Collection.prototype.typeNamePlural = "collections";
Collection.prototype.codeLetter = "k";

Collection.prototype.IsCollection = function () {
	return true;
}

module.exports = {
	Collection: Collection
};


