package handlers

import (
	"database/sql"

	"github.com/lheinrichde/gorum/pkg/db"
)

// Boards handler
func Boards(request map[string]interface{}, username string, auth bool) interface{} {
	var err error

	// query db
	var rows *sql.Rows
	rows, err = db.DB.Query(`SELECT boards.id, boards.boardname, boards.boarddescription,
							boards.boardicon, categories.categoryname FROM boards
							INNER JOIN categories ON boards.category = categories.id
							ORDER BY boards.sort + categories.sort ASC;`)
	if err != nil {
		// return error
		return err
	}

	// boards list to write
	categories := map[string]interface{}{}

	// loop through users
	for rows.Next() {
		// scan
		var id int
		var name, description, icon, category string
		err = rows.Scan(&id, &name, &description, &icon, &category)
		if err != nil {
			// return error
			return err
		}

		// board map to append
		board := map[string]interface{}{}
		board["id"] = id
		board["name"] = name
		board["description"] = description
		board["icon"] = icon

		// append board to categories map
		if categories[category] == nil {
			categories[category] = []map[string]interface{}{}
		}
		categories[category] = append(categories[category].([]map[string]interface{}), board)
	}

	// write map
	return categories
}
