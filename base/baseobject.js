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



KZBaseObject.prototype.Index = function (index) {
	this.SetIndex(index);
	return this.GetIndex();
}

KZBaseObject.prototype.SetIndex = function (index) {
	if (index != undefined) {
		this.index = index;
	}
}

KZBaseObject.prototype.GetIndex = function () {
	return this.index;
}



KZBaseObject.prototype.CodeName = function () {
	return this.codeLetter + this.index;
}



module.exports = {
	KZBaseObject: KZBaseObject
};


