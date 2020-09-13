// author.js


const Entity = require("./entity").Entity;

function Author(site, entry) {
	this.site = site;
	this.name = entry.trim();
	this.SetupEntity();
}

Author.prototype = new Entity();
Author.prototype.typename = "author";
Author.prototype.typenamePlural = "authors";
Author.prototype.codeLetter = "a";

Author.prototype.IsAuthor = function () {
	return true;
}

Author.prototype.GetPages = function () {
	let pages = [];
	for (let index in this.site.pages) {
		let page = this.site.pages[index];
		let author = page.GetPropertyCascaded("author");
		if (author.found && author.value == this.name) {
			pages.push(page);
		}
	}
	return pages;
}

module.exports = {
	Author: Author
};


