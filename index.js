const db = require("./utils/db");
const express = require('express');
const app = express();
const multer = require('multer');
const uidSafe = require('uid-safe');
const path = require('path');
const s3 = require("./s3");
const {s3Url} = require("./config");

app.use(express.json());

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + '/uploads');
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});
app.use(express.static('./public'));

//Modal
// $('#myModal').on('shown.bs.modal', function () {
//     $('#myInput').trigger('focus');
// });

app.get('/animals', (req, res) => {
    let animals = [
        {
            name: "Squid",
            emoji: "🦑"
        },
        {
            name: "Ewe",
            emoji: "🐑"
        }
    ];

    res.json(animals);
});
// upload Images
app.post("/upload", uploader.single("file"), s3.upload, (req,res) =>{
    const {title, description, username} = req.body;
    const url = `${s3Url}${req.file.filename}`;
    db.addImage(
        title, username, description, url
    ).then(

        ({rows}) => res.json({
            // res.json(rows);
            image: rows[0]
        }).catch(err => {
            console.log("addImage error: ", err);
        })
    );

    //unshift the ubject in the

    console.log("this is the upload: ");
    console.log("req.file: ", req.file);
    console.log("input req.body :", req.body);
    // if (req.file){
    //     res.json({success: true});
    // } else{
    //     res.json({success: false});
    // }
});

//GET images
app.get("/images",(req, res)=> {
    db.getImages()
        .then(({ rows }) => {

            res.json(rows);
        })
        .catch(err => {
            console.log("getImages error: ", err);
        });

});

app.get("/images/:id",(req, res)=> {
    db.scroll(req.params.id)
        .then(({ rows }) => {

            res.json(rows);
        })
        .catch(err => {
            console.log("scroll error: ", err);
        });

});

app.get("/modal/:id", (req,res) =>{
    console.log("req.params.id: ", req.params.id);
    db.selectedImage(req.params.id)
        .then(results=>{
            db.getComment(req.params.id)
                .then(data=>{
                    console.log("data.rows: ", data.rows);
                    res.json({
                        image: results.rows[0],
                        comments: data.rows
                    });
                }).catch(err =>{
                    console.log("getComment error: ", err);
                });
        }).catch(err =>{
            console.log("selectedImage error: ", err);
        });
});

//upload comments
app.post("/modal/comment", (req,res) =>{
    const {username, comment, id} = req.body;
    console.log("comment req.body: ", req.body);
    db.addComment(
        username,
        comment,
        id
    ).then(
        ({rows}) => {
            res.json(rows);
        }).catch(err => {
        console.log("addComment error: ", err);
    });
});

//getComment
// app.get("/comment/:id", (req,res) =>{
//     console.log("req.params.id: ", req.params.id);
//     db.getComment(req.params.id)
//         .then(({rows})=>{
//             res.json(rows);
//         }).catch(err =>{
//             console.log("getComment error: ", err);
//         });
// });


app.listen(8080, () =>console.log("imageboard working"));
