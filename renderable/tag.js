// tag.js


const Entity = require("./entity").Entity;

function Tag(site, entry) {
	this.site = site;
	this.name = entry.trim();
	this.SetupEntity();
}

Tag.prototype = new Entity();
Tag.prototype.typename = "tag";
Tag.prototype.typenamePlural = "tags";
Tag.prototype.codeLetter = "t";

Tag.prototype.IsTag = function () {
	return true;
}

Tag.prototype.GetPages = function () {
	let pages = [];
	for (let index in this.site.pages) {
		let page = this.site.pages[index];
		if (page.tags.includes(this.name)) {
			pages.push(page);
		}
	}
	return pages;
}

module.exports = {
	Tag: Tag
};


