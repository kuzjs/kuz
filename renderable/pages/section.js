// section.js

const pug = require("pug");



function GetNameAndData (headerText) {
	let openBracket = headerText.indexOf("[");
	let closeBracket = headerText.indexOf("]");
	let name = headerText.slice(openBracket + 1, closeBracket).trim();
	let data = headerText.slice(closeBracket + 1).trim();
	return {
		name: name,
		data: data
	};
}

function Section (article, headerText) {
	this.article = article;
	let nd = GetNameAndData(headerText);
	this.name = nd.name;
	this.content = nd.data;
}

Section.prototype.AddLine = function (contentLine) {
	if (this.content.length == 0) {
		this.content = contentLine;
	} else {
		this.content += "\n" + contentLine;
	}
}

Section.prototype.Html = function () {
	return pug.render(this.content, options=this.article.page.GetPageOptionsFN());
}

Section.prototype.Name = function () {
	return this.name;
}



module.exports = {
	Section: Section
};


