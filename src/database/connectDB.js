const mongoose = require("mongoose");
const { DB_CONNECTTION_STRING } = require("../config");

// Step 1. Connect to DB
async function connectDatabase() {
    return new Promise((resolve, reject) => {
        // protocol://hostname:port/db_name
        // protocol://username@password:hostname:port/db_name
        mongoose.connect(DB_CONNECTTION_STRING, (err) => {
            if (err) {
                console.log('Error conencting to DB')
                reject(err)
            } else {
                console.log('Successfully connected to DB')
                resolve()
            }
        })
    })
}

module.exports = {
    connectDatabase
}