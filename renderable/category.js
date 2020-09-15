// category.js


const Entity = require("./entity").Entity;

function Category(site, entry) {
	this.site = site;
	this.name = entry.trim();
	this.SetupEntity();
}

Category.prototype = new Entity();
Category.prototype.typeName = "category";
Category.prototype.typeNamePlural = "categories";
Category.prototype.codeLetter = "c";

Category.prototype.IsCategory = function () {
	return true;
}

Category.prototype.GetPages = function () {
	let pages = [];
	for (let index in this.site.pages) {
		let page = this.site.pages[index];
		let category = page.GetPropertyCascaded("category");
		if (category.found && category.value == this.name) {
			pages.push(page);
		}
	}
	return pages;
}

module.exports = {
	Category: Category
};


