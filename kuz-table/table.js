// table.js



function GetCellString (cellString) {
	return cellString ? cellString + "" : "-";
}

function KuZTable () {
	this.Reset();
}

KuZTable.prototype.Reset = function () {
	this.columnObjects = [];
	this.paddingLength = 1;
	this.rowData = [];
	this.showIndex = true;
	this.showHeader = true;
	this.firstColumn = {
		name: "Id",
		length: 5
	};
	return this;
}

KuZTable.prototype.ShowIndex = function () {
	this.showIndex = true;
	return this;
}

KuZTable.prototype.HideIndex = function () {
	this.showIndex = false;
	return this;
}

KuZTable.prototype.ShowHeader = function () {
	this.showHeader = true;
	return this;
}

KuZTable.prototype.HideHeader = function () {
	this.showHeader = false;
	return this;
}

KuZTable.prototype.Clear = function () {
	this.rowData = [];
	return this;
}

KuZTable.prototype.SetPadding = function (paddingLength) {
	this.paddingLength = paddingLength;
	return this;
}

KuZTable.prototype.Padding = function () {
	let padding = "";
	return padding.padStart(this.paddingLength);
}

KuZTable.prototype.Separator = function () {
	return this.Padding() + "|" + this.Padding();
}

KuZTable.prototype.addColumn = function (columnName, columnLength) {
	if (columnLength === undefined || columnLength < columnName.length) {
		columnLength = columnName.length;
	}

	this.columnObjects.push({
		name: columnName,
		length: columnLength
	});
	return this;
}

KuZTable.prototype.add = function (obj) {
	let row = obj["getRow"]();
	this.addRow(row);
	return this;
}

KuZTable.prototype.addArray = function (arr) {
	for (let elem of arr) {
		this.add(elem);
	}
	return this;
}

KuZTable.prototype.addRow = function (row) {
	for (let index in row) {
		let cell = row[index] + "";
		if (cell.length > this.columnObjects[index].length) {
			this.columnObjects[index].length = cell.length;
		}
	}
	this.rowData.push(row);
	return this;
}

KuZTable.prototype.GetColumnLength = function (columnIndex) {
	return this.columnObjects[columnIndex].length;
}

KuZTable.prototype.getRowLength = function () {
	let rowLength = this.firstColumn.length + (2 * this.Separator().length) - this.paddingLength;
	for (let columnObject of this.columnObjects) {
		rowLength += columnObject.length + this.Separator().length;
	}

	rowLength -= this.paddingLength;
	return (rowLength);
}

KuZTable.prototype.GetNDashes = function (n) {
	let dashes = "";
	return dashes.padStart(n, "-");
}

KuZTable.prototype.GetColumnDashes = function (columnLength) {
	return this.GetNDashes(this.paddingLength + columnLength + this.paddingLength);
}

KuZTable.prototype.getRowSeparator = function () {
	let separator = "+";

	let rowSeparator;
	if (this.showIndex) {
		rowSeparator = separator + this.GetColumnDashes(this.firstColumn.length) + separator;
	} else {
		rowSeparator = separator;
	}

	for (let columnObject of this.columnObjects) {
		let columnLength = columnObject.length;
		rowSeparator += this.GetColumnDashes(columnLength) + separator;
	}
	return rowSeparator;
}

KuZTable.prototype.getRowString = function (rowId, row) {
	let rowString;
	if (this.showIndex) {
		rowString = "|" + this.Padding() + rowId.padStart(this.firstColumn.length) + this.Separator();
	} else {
		rowString = "|" + this.Padding();
	}

	for (let j in row) {
		let columnLength = this.GetColumnLength(j);
		let cell = GetCellString(row[j]);
		rowString += cell.padStart(columnLength) + this.Separator();
	}
	return rowString;
}

KuZTable.prototype.GetHeaderRowString = function () {
	let row = [];
	let rowId = this.firstColumn.name;
	for (let i=0; i<this.columnObjects.length; i++) {
		row.push(this.columnObjects[i].name);
	}
	return this.getRowString(rowId, row);
}

KuZTable.prototype.GetDataRowString = function (rowIndex) {
	let row = this.rowData[rowIndex];
	let rowId = (rowIndex+1) + "";
	return this.getRowString(rowId, row);
}

KuZTable.prototype.printRow = function (rowIndex) {
	let rowString = this.GetDataRowString(rowIndex);
	console.log(rowString);
}

KuZTable.prototype.print = function () {
	let rowSeparator = this.getRowSeparator();
	let headerRowString = this.GetHeaderRowString();

	console.log(rowSeparator);
	if (this.showHeader) {
		console.log(headerRowString);
		console.log(rowSeparator);
	}
	for (let i=0; i<this.rowData.length; i++) {
		this.printRow(i);
	}
	console.log(rowSeparator);
	return this;
}



module.exports = {
	KuZTable: KuZTable
};


