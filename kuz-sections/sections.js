


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
	//
}



function KuzSections (sectionLines) {
	//this.Setup(sectionLines);
}

KuzSections.prototype.IsValid = function () {
	return true;
}



module.exports = {
	KuzSections: KuzSections
};


