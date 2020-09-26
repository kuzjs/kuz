// sections.js



function GetLabel (sectionLine) {
	let trimmedLine = sectionLine.trim();
	if (trimmedLine.startsWith("[") && trimmedLine.includes("]")) {
		let parts = trimmedLine.split("]");
		let fullLabel = parts[0].slice(1).trim();
		let heading = parts[1].trim();

		let labelParts = fullLabel.split("|");
		let mods = [];
		for (let labelPart of labelParts.slice(1)) {
			mods.push(labelPart.trim());
		}
		return {
			found: true,
			heading: heading,
			name: labelParts[0].trim(),
			mods: mods
		};
	} else {
		return {
			found: false
		};
	}
}



function Section (label) {
	this.name = label.name;
	this.mods = label.mods;
	this.heading = label.heading;
	this.lines = [];
}

Section.prototype.addLine = function (sectionLine) {
	this.lines.push(sectionLine);
}

Section.prototype.getNumberOfLines = function () {
	return this.lines.length;
}



function KuzSections (sectionLines) {
	this.setup(sectionLines);
}



KuzSections.prototype.setup = function (sectionLines) {
	this.sections = [];
	let mainLabel = GetLabel("[main]");
	let currentSection = new Section(mainLabel);
	this.sections.push(currentSection);

	for (let sectionLine of sectionLines) {
		let sectionLineText = sectionLine[1];
		let currentLabel = GetLabel(sectionLineText);
		if (currentLabel.found) {
			currentSection = this.getSectionByName(currentLabel.name);
			if (!currentSection) {
				currentSection = new Section(currentLabel);
				this.sections.push(currentSection);
			}
		} else {
			currentSection.addLine(sectionLine);
		}
	}
}

KuzSections.prototype.ok = function () {
	return true;
}

KuzSections.prototype.getSectionsObject = function () {
	let sections = {};
	for (let section of this.sections) {
		sections[section.name] = section;
	}
	return sections;
}

KuzSections.prototype.getSectionByName = function (name) {
	for (let section of this.sections) {
		if (section.name === name) {
			return section;
		}
	}
	return null;
}



module.exports = KuzSections;


