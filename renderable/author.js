// author.js



function Author(site, configFileObject, entry) {
	this.SetupEntity(site, configFileObject, entry);
}

const Entity = require("./entity").Entity;
Author.prototype = new Entity();
Author.prototype.typeName = "author";
Author.prototype.typeNamePlural = "authors";
Author.prototype.codeLetter = "a";

Author.prototype.IsAuthor = function () {
	return true;
}

Author.prototype.GetPages = function () {
	let pages = [];
	for (let page of this.site.pages) {
		let author = page.GetPropertyCascaded("author");
		if (author.found && author.value == this.Name()) {
			pages.push(page);
		}
	}
	return pages;
}

module.exports = {
	Author: Author
};


