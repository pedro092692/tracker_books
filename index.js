// ------- PROJECT REQUIREMENTS  ------- \\

// Make tracks books app for review your favorites books and add notes 
// 1. Add new book for read. (add total pages and paged red show percent)
// 2. Add score to read book. 
// 3. Add notes to a book once read books
// 4. Sort books by score.
// 5. Sort books by read and not reads. 
// 6. New books notes.
// 7. Using this api to get books info https://openlibrary.org/dev/docs/api/covers

//imports 
import express from 'express';
import bodyParser from 'body-parser';
import pg from 'pg';

// set up app
const app = express();
const port = 3000;


app.get('/', (req, res) => {
    res.render('index.ejs');
});


//start server 
app.listen(port, (erro) => {
    console.log(`Server is running at http://localhost:${port}`);
})
