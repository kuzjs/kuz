// category.js



function Category(site, configFileObject, entry) {
	this.SetupEntity(site, configFileObject, entry);
}

const Entity = require("./entity").Entity;
Category.prototype = new Entity();
Category.prototype.typeName = "category";
Category.prototype.typeNamePlural = "categories";
Category.prototype.codeLetter = "c";

Category.prototype.IsCategory = function () {
	return true;
}

Category.prototype.GetPages = function () {
	let pages = [];
	for (let page of this.site.pages) {
		let category = page.GetPropertyCascaded("category");
		if (category.found && category.value == this.Name()) {
			pages.push(page);
		}
	}
	return pages;
}

module.exports = {
	Category: Category
};


