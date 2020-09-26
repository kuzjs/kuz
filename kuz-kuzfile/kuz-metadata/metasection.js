// metasection.js



function KuzMetaSection (kuz, section) {
	this.kuz = kuz;
	this.name = section.name;
	this.heading = section.heading;
	this.mods = section.mods;
	this.props = {};
	this.setup(section.lines);
}

KuzMetaSection.prototype.setup = function (sectionLines) {
	const KuzProperty = require("./property");
	for (let line of sectionLines) {
		let lineNumber = line[0];
		let lineText = line[1];
		let property = new KuzProperty(lineText);
		if (property.ok()) {
			if (this.props[property.name] === undefined) {
				this.props[property.name] = property.value;
			} else {
				this.log.red(`Multiple definitions on L${lineNumber}: [${property.name}]`);
			}
		} else {
			this.log.red(`Bad property on L${lineNumber}: [${lineText}]`);
		}
	}
}



module.exports = KuzMetaSection;


