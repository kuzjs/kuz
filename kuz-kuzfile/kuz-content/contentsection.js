// contentsection.js

const pug = require("pug");



function KuzContentSection (kuz, section) {
	this.kuz = kuz;
	this.name = section.name;
	this.heading = section.heading;
	this.mods = section.mods;
	this.content = "";
	this.setup(section.lines);
}

KuzContentSection.prototype.setup = function (sectionLines) {
	for (let sectionLine of sectionLines) {
		this.content += sectionLine[1] + "\n";
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

KuzContentSection.prototype.getHtml = function () {
	return pug.render(this.content, options=this.kuz.owner.getPageOptions());
}



module.exports = KuzContentSection;


