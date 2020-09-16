// tag.js


const Entity = require("./entity").Entity;

function Tag(site, entry) {
	this.site = site;
	this.name = entry.trim();
	this.SetupEntity();
}

Tag.prototype = new Entity();
Tag.prototype.typeName = "tag";
Tag.prototype.typeNamePlural = "tags";
Tag.prototype.codeLetter = "t";

Tag.prototype.IsTag = function () {
	return true;
}

Tag.prototype.GetPages = function () {
	let pages = [];
	for (let page of this.site.pages) {
		if (page.Tags().includes(this.name)) {
			pages.push(page);
		}
	}
	return pages;
}

module.exports = {
	Tag: Tag
};


