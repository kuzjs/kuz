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



module.exports = {
	KZBaseObject: KZBaseObject
};


