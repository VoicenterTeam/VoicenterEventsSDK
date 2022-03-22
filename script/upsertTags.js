const mysql = require('mysql');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

let tags = JSON.parse(fs.readFileSync(path.join('src', 'locales', 'en.json')))

try {
    const connection = mysql.createConnection({
        host     : process.env.DB_HOST,
        user     : process.env.DB_USERNAME,
        port     : process.env.DB_PORT,
        password : process.env.DB_PASSWORD,
        database : process.env.DB_NAME
    })

    connection.connect(function(err) {
        if (err) {
            console.error(err)
        }
    })

    const tagListData = JSON.stringify({
        "SectionTagList": {
            ...tags
        },
        "TagValueMatchType": 5,
        "IsInsertOnly": 0,
        "TagSystem": 2
    })

    connection.query("CALL SP_UpsertTagList(?)", [tagListData], function (err, result) {
        if (err) {
            console.error("ERROR", err);
        } else {
            console.log("SUCCESS", result);
        }
    })

    connection.end(function(err) {
        if (err) {
            console.error(err)
        }
    })
} catch (e) {
    console.error(e)
}
