// db.js
const spicedPg = require('spiced-pg');

const db = spicedPg(process.env.DATABASE_URL || 'postgres:postgres:postgres@localhost:5432/imageboard');


module.exports.getImages = function getImages() {
    return db.query('SELECT * FROM images ORDER BY id DESC LIMIT 6');
};

module.exports.addImage = function addImage(title, username, description, url) {
    return db.query('INSERT INTO images (title, username, description, url) VALUES ($1, $2, $3, $4) RETURNING *',
        [title, username, description, url]);
};

module.exports.selectedImage = function selectedImage(id) {
    return db.query('SELECT * FROM images WHERE id = $1',
        [id]);
};
//COMMENTS
exports.addComment = function addComment(username, comment, image_id) { //accepts two arguments. the first one is the query
    return db.query('INSERT INTO comments (username, comment, image_id) VALUES ($1, $2, $3) RETURNING *',
        [username, comment, image_id]); //this array will look exactly like the arguments from the function
};

module.exports.getComment = function getComment(image_id) {
    return db.query('SELECT * FROM comments WHERE image_id = $1', [image_id]); //accepts two arguments. the first one is the query
};

//scroll
exports.scroll = function scroll(id) {
    return db.query('SELECT * FROM images WHERE id < $1 ORDER BY id DESC LIMIT 6', [id]);
};



// one query to show the first 10 images
// SELECT * FROM images
// ORDER BY id DESC
// LIMIT 10;
//
// a query to make th uploaded pictura to have lo lowest id
// SELECT * FROM images
// WHERE id < $1
// ORDER BY id DESC
// LIMIT 10;
//
// a query to know if there are more images to show (more button)
// SELECT id FROM images
// ORDER BY id ASC
// LIMIT 1;
//
// to combine two queries
// SELECT images.*,(
//     SELECT id FROM images
//     ORDER BY id ASC
//     LIMIT 1;
// ) AS "lowestId" FROM images
// WHERE id < 12
// ORDER BY id DESC
// LIMIT 10;;
