// table.js



function GetCellString (cellString) {
	return cellString ? cellString + "" : "-";
}

function KuzTable () {
	this.reset();
}

KuzTable.prototype.reset = function () {
	this.columnObjects = [];
	this.paddingLength = 1;
	this.rowData = [];
	this.show_index = true;
	this.show_header = true;

	this.color = false;
	this.headerColor = false;
	this.frameColor = false;

	this.firstColumn = {
		name: "Id",
		length: 5,
		color: false
	};
	return this;
}

KuzTable.prototype.clear = function () {
	this.rowData = [];
	return this;
}



KuzTable.prototype.colorIsOn = function () {
	return this.color;
}

KuzTable.prototype.colorIsOff = function () {
	return !this.colorIsOn();
}



KuzTable.prototype.setHeaderColor = function (headerColor) {
	this.headerColor = headerColor;
}

KuzTable.prototype.setFrameColor = function (frameColor) {
	this.frameColor = frameColor;
}



KuzTable.prototype.showIndex = function () {
	this.show_index = true;
	return this;
}

KuzTable.prototype.hideIndex = function () {
	this.show_index = false;
	return this;
}

KuzTable.prototype.showHeader = function () {
	this.show_header = true;
	return this;
}

KuzTable.prototype.hideHeader = function () {
	this.show_header = false;
	return this;
}



KuzTable.prototype.setPadding = function (paddingLength) {
	this.paddingLength = paddingLength;
	return this;
}

KuzTable.prototype.getPaddingString = function () {
	let padding = "";
	return padding.padStart(this.paddingLength);
}

KuzTable.prototype.getSeparator = function () {
	return this.getPaddingString() + "|" + this.getPaddingString();
}

KuzTable.prototype.addColumn = function (columnName, columnLength, columnColor=false) {
	if (columnLength === undefined || columnLength < columnName.length) {
		columnLength = columnName.length;
	}

	this.columnObjects.push({
		name: columnName,
		length: columnLength,
		color: columnColor
	});
	return this;
}



KuzTable.prototype.add = function (obj) {
	let row = obj["getRow"]();
	this.addRow(row);
	return this;
}

KuzTable.prototype.addArray = function (arr) {
	for (let elem of arr) {
		this.add(elem);
	}
	return this;
}

KuzTable.prototype.addRow = function (row) {
	for (let index in row) {
		let cell = row[index] + "";
		if (cell.length > this.columnObjects[index].length) {
			this.columnObjects[index].length = cell.length;
		}
	}
	this.rowData.push(row);
	return this;
}

KuzTable.prototype.addSeparatorRow = function () {
	this.rowData.push(false);
	return this;
}



KuzTable.prototype.getColumnLength = function (columnIndex) {
	return this.columnObjects[columnIndex].length;
}

KuzTable.prototype.getRowLength = function () {
	let rowLength = this.firstColumn.length + (2 * this.getSeparator().length) - this.paddingLength;
	for (let columnObject of this.columnObjects) {
		rowLength += columnObject.length + this.getSeparator().length;
	}

	rowLength -= this.paddingLength;
	return (rowLength);
}

KuzTable.prototype.getNDashes = function (n) {
	let dashes = "";
	return dashes.padStart(n, "-");
}

KuzTable.prototype.getColumnDashes = function (columnLength) {
	return this.getNDashes(this.paddingLength + columnLength + this.paddingLength);
}

KuzTable.prototype.getRowSeparator = function () {
	let separator = "+";

	let rowSeparator;
	if (this.show_index) {
		rowSeparator = separator + this.getColumnDashes(this.firstColumn.length) + separator;
	} else {
		rowSeparator = separator;
	}

	for (let columnObject of this.columnObjects) {
		let columnLength = columnObject.length;
		rowSeparator += this.getColumnDashes(columnLength) + separator;
	}
	return rowSeparator;
}

KuzTable.prototype.getRowString = function (rowId, row) {
	let rowString;
	if (this.show_index) {
		rowString = "|" + this.getPaddingString() + rowId.padStart(this.firstColumn.length) + this.getSeparator();
	} else {
		rowString = "|" + this.getPaddingString();
	}

	for (let j in row) {
		let columnLength = this.getColumnLength(j);
		let cell = GetCellString(row[j]);
		rowString += cell.padStart(columnLength) + this.getSeparator();
	}
	return rowString;
}

KuzTable.prototype.getHeaderRowString = function () {
	let row = [];
	let rowId = this.firstColumn.name;
	for (let i=0; i<this.columnObjects.length; i++) {
		row.push(this.columnObjects[i].name);
	}
	return this.getRowString(rowId, row);
}

KuzTable.prototype.getDataRowString = function (rowIndex) {
	let row = this.rowData[rowIndex];
	let rowId = (rowIndex+1) + "";
	return this.getRowString(rowId, row);
}

KuzTable.prototype.printRow = function (rowIndex) {
	let rowString = this.getDataRowString(rowIndex);
	console.log(rowString);
}

KuzTable.prototype.print = function () {
	let rowSeparator = this.getRowSeparator();
	let headerRowString = this.getHeaderRowString();

	console.log(rowSeparator);
	if (this.show_header) {
		console.log(headerRowString);
		console.log(rowSeparator);
	}
	for (let i=0; i<this.rowData.length; i++) {
		if (this.rowData[i] === false) {
			console.log(rowSeparator);
		} else {
			this.printRow(i);
		}
	}
	console.log(rowSeparator);
	return this;
}



module.exports = KuzTable;


