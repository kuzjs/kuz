// collections.js


const Entity = require("./entity").Entity;

function Collection(site, entry) {
	this.site = site;
	this.name = entry.trim();
	this.SetupEntity();
}

Collection.prototype = new Entity();
Collection.prototype.typename = "collection";
Collection.prototype.typenamePlural = "collections";
Collection.prototype.codeLetter = "k";

Collection.prototype.IsCollection = function () {
	return true;
}

module.exports = {
	Collection: Collection
};


