const mongoose = require('mongoose');
require('dotenv').config()


async function main() {
    await mongoose.connect(process.env.DB_URL);
}


main().catch(err => console.log(err));



const urlSchema = new mongoose.Schema({
    url: {
        type: String
    },
    shortUrlId: {
        type: String
    },
    clicks: {
        type: Number,
    },
    time: {
        type: Date,
        default: Date.now()
    }
}); 

const urlModel = mongoose.model('url', urlSchema);

module.exports = urlModel;