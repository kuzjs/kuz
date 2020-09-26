// contentsection.js



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



module.exports = KuzContentSection;


