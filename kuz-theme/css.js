// cssfile.js



function ThemeCSS (theme, data) {
	this.SetupProto(theme, data);
}

const ProtoFile = require("./protofile").ProtoFile;
ThemeCSS.prototype = new ProtoFile("css");
ThemeCSS.prototype.typeName = "CSS";

ThemeCSS.prototype.IsCssFile = function () {
	return true;
}



module.exports = {
	ThemeCSS: ThemeCSS
};


