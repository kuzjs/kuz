// baseobject.js



function KZBaseObject () {
	//
}



KZBaseObject.prototype.Site = function (site) {
	this.SetSite(site);
	return this.GetSite();
}

KZBaseObject.prototype.SetSite = function (site) {
	if (site != undefined) {
		this.site = site;
	}
	return this;
}

KZBaseObject.prototype.GetSite = function () {
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
	return this;
}

KZBaseObject.prototype.GetIndex = function () {
	return this.index;
}



KZBaseObject.prototype.Title = function (title) {
	this.SetTitle(title);
	return this.GetTitle();
}

KZBaseObject.prototype.SetTitle = function (title) {
	if (title != undefined) {
		this.title = title;
	}
	return this;
}

KZBaseObject.prototype.GetTitle = function () {
	return this.title;
}



KZBaseObject.prototype.Name = function (name) {
	this.SetName(name);
	return this.GetName();
}

KZBaseObject.prototype.SetName = function (name) {
	if (name != undefined) {
		this.name = name;
	}
	return this;
}

KZBaseObject.prototype.GetName = function () {
	return this.name;
}



KZBaseObject.prototype.Next = function () {
	return this.next;
}

KZBaseObject.prototype.Previous = function () {
	return this.previous;
}



KZBaseObject.prototype.IsEntity = function () {
	return false;
}

KZBaseObject.prototype.IsAuthor = function () {
	return false;
}

KZBaseObject.prototype.IsCategory = function () {
	return false;
}

KZBaseObject.prototype.IsTag = function () {
	return false;
}

KZBaseObject.prototype.IsPage = function () {
	return false;
}

KZBaseObject.prototype.IsCollection = function () {
	return false;
}



KZBaseObject.prototype.IsTheme = function () {
	return false;
}

KZBaseObject.prototype.IsLayout = function () {
	return false;
}

KZBaseObject.prototype.IsModule = function () {
	return false;
}

KZBaseObject.prototype.IsProtoFile = function () {
	return false;
}

KZBaseObject.prototype.IsCssFile = function () {
	return false;
}

KZBaseObject.prototype.IsJsFile = function () {
	return false;
}

KZBaseObject.prototype.IsResFile = function () {
	return false;
}



KZBaseObject.prototype.CodeName = function () {
	return this.codeLetter + this.index;
}



module.exports = {
	KZBaseObject: KZBaseObject
};


