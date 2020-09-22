


function GetLabel (sectionLine) {
	let trimmedLine = sectionLine.trim();
	if (trimmedLine.startsWith("[") && trimmedLine.endsWith("]")) {
		let fullLabel = trimmedLine.slice(1, -1);
		let labelParts = fullLabel.split("|");
		let mods = [];
		for (let labelPart of labelParts.slice(1)) {
			mods.push(labelPart.trim());
		}
		return {
			found: true,
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
	this.lines = [];
}

Section.prototype.AddLine = function (sectionLine) {
	this.lines.push(sectionLine);
}

Section.prototype.NumberOfLines = function () {
	return this.lines.length;
}



function KuzSections (sectionLines) {
	this.Setup(sectionLines);
}



KuzSections.prototype.Setup = function (sectionLines) {
	this.sections = [];
	let mainLabel = GetLabel("[main]");
	let currentSection = new Section(mainLabel);
	this.sections.push(currentSection);

	for (let sectionLine of sectionLines) {
		let currentLabel = GetLabel(sectionLine);
		if (currentLabel.found) {
			currentSection = this.GetSectionByName(currentLabel.name);
			if (!currentSection) {
				currentSection = new Section(currentLabel);
				this.sections.push(currentSection);
			}
		} else {
			currentSection.AddLine(sectionLine);
		}
	}
}

KuzSections.prototype.ok = function () {
	return true;
}

KuzSections.prototype.SectionsObject = function () {
	let sections = {};
	for (let section of this.sections) {
		sections[section.name] = section;
	}
	return sections;
}

KuzSections.prototype.GetSectionByName = function (name) {
	for (let section of this.sections) {
		if (section.name == name) {
			return section;
		}
	}
	return null;
}



module.exports = {
	KuzSections: KuzSections
};


