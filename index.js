const express = require('express')
const uniqid = require('uniqid');
const bodyParser = require('body-parser');
const urlModel = require('./models/urlModel')
require('dotenv').config()


const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs")

app.get('/', (req, res) => {
    res.render('index')
})

app.post('/api/generate-short-link', async (req, res) => {
    const newURL = new urlModel({ url: req.body.url, shortUrlId: uniqid(), clicks: 0 });
    await newURL.save((err, result) => {
        if (err) {
            console.log(err)
            res.json({status: 0, originalUrl: req.body.url, error: err.message});
        } else {
            let shortUrl  = process.env.APP_URL+"/"+result.shortUrlId;
            res.json({status: 1, originalUrl: result.url, shortUrl: shortUrl, time: result.time});
        }
    });
})

app.get("/:short_url", (req, res) => {
     urlModel.findOneAndUpdate({shortUrlId: req.params.short_url},{$inc: {'clicks': 1}}, {new: true}, (err, doc) => {
        if(err) {
            if(err === null){
                res.json({status: 0, message: "Link Not Found"})
            }
        }else{
            // res.json(doc)
            res.redirect(doc.url);
        }
    }).clone()
});

app.listen(process.env.PORT);