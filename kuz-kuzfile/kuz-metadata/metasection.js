// metasection.js



function KuzMetaSection (kuz, section) {
	this.kuz = kuz;
	this.name = section.name;
	this.heading = section.heading;
	this.mods = section.mods;
	this.content = "";
	this.setup(section.lines);
}

KuzMetaSection.prototype.setup = function (sectionLines) {
	//
}



module.exports = KuzMetaSection;


