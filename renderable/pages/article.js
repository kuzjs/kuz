// article.js

const pug = require("pug");
const Section = require("./section").Section;

function Article(page, content) {
	this.Init(page, content);
}

Article.prototype.Init = function (page, content) {
	this.page = page;
	this.contentLines = content.split("\n");
	this.sections = [];

	let currentSection = new Section(this, "[content]");
	this.sections.push(currentSection);

	for (let index in this.contentLines) {
		let contentLine = this.contentLines[index];
		if (contentLine.includes("[") && contentLine.includes("]")) {
			currentSection = new Section(this, contentLine);
			this.sections.push(currentSection);
		} else {
			currentSection.AddLine(contentLine);
		}
	}
}

Article.prototype.IsArticle = function () {
	return true;
}

Article.prototype.Section = function (sectionName) {
	for (let index in this.sections) {
		let section = this.sections[index];
		if (section.Name() == sectionName) {
			return section;
		}
	}
	return null;
}

Article.prototype.ContentHtml = function () {
	return pug.render(this.sections[0].content, options=this.page.GetPageOptionsFN());
}

Article.prototype.Html = function () {
	return pug.render(this.content, options=this.page.GetPageOptionsFN());
}

Article.prototype.Site = function () {
	return this.page.Site();
}

Article.prototype.App = function () {
	return this.page.App();
}

Article.prototype.Blackadder = function () {
	return this.page.Blackadder();
}

Article.prototype.LoremIpsum = function () {
	return this.page.LoremIpsum();
}

Article.prototype.Html = function () {
	return "Hello, PageType!";
}

module.exports = {
	Article: Article
};


