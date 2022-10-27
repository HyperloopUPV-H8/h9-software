package excelRetriever

type Structure struct {
	Sheets map[string]Sheet
}

type Sheet struct {
	Name   string
	Tables map[string]Table
}

type Table struct {
	Name string
	Rows []Row
}

type Row = []Cell

type Cell = string
