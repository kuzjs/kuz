// article.js

const pug = require("pug");
const Section = require("./section").Section;

function Article(page, content) {
	this.Setup(page, content);
}

Article.prototype.Setup = function (page, content) {
	this.page = page;
	this.contentLines = content.split("\n");
	this.sections = {};

	let currentSection = new Section(this, "[content]");
	this.sections[currentSection.Name()] = currentSection;

	for (let contentLine of this.contentLines) {
		if (contentLine.includes("[") && contentLine.includes("]")) {
			currentSection = new Section(this, contentLine);
			this.sections[currentSection.Name()] = currentSection;
		} else {
			currentSection.AddLine(contentLine);
		}
	}
}

Article.prototype.IsArticle = function () {
	return true;
}

Article.prototype.Section = function (sectionName) {
	for (let key in this.sections) {
		if (key == sectionName) {
			return this.sections[key];
		}
	}
	return null;
}

Article.prototype.GetContentHtml = function () {
	return pug.render(this.sections["content"].content, options=this.page.GetPageOptionsFN());
}

Article.prototype.Html = function () {
	return pug.render(this.content, options=this.page.GetPageOptionsFN());
}

Article.prototype.Html = function () {
	return "Hello, PageType!";
}

module.exports = {
	Article: Article
};


