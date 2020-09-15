// baseobject.js



function KZBaseObject () {
	//
}

KZBaseObject.prototype.Site = function (site) {
	if (site != undefined) {
		this.site = site;
	}
	return this.site;
}

KZBaseObject.prototype.CodeName = function () {
	return this.codeLetter + this.index;
}



module.exports = {
	KZBaseObject: KZBaseObject
};


