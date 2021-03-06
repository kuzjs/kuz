// contentsection.js

const pug = require("pug");



function KuzContentSection (kuz, section) {
	this.kuz = kuz;
	this.name = section.name;
	this.heading = section.heading;
	this.mods = section.mods;
	this.content = "";
	this.numberOfLines = 0;
	this.setup(section.lines);
}

KuzContentSection.prototype.setup = function (sectionLines) {
	for (let sectionLine of sectionLines) {
		this.content += sectionLine[1] + "\n";
		this.numberOfLines++;
	}
}

KuzContentSection.prototype.getName = function () {
	return this.name;
}

KuzContentSection.prototype.getHeading = function () {
	return this.heading;
}

KuzContentSection.prototype.getMods = function () {
	return this.mods;
}

KuzContentSection.prototype.getNumberOfLines = function () {
	return this.numberOfLines;
}

KuzContentSection.prototype.getHtml = function () {
	return pug.render(this.content, options=this.kuz.owner.getPageOptions());
}



module.exports = KuzContentSection;


