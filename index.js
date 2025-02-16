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
import express, { query } from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import pg from 'pg';


// set up app
const app = express();
const port = 3000;
const API_URL = 'https://openlibrary.org/'
const headers = {
    'User-Agent': "book_tracker_app/1.0 (pedro092692@gmail.com)"
}

// database 
const db = new pg.Client({
    user: 'postgres', 
    host: 'localhost',
    database: 'library',
    password: '12345678',
    port: 5432,
});

// error 
let error;

// connect data base
db.connect();

//middlewere 
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));


app.get('/', async(req, res) => {
    const books = await searchBook('python', 8);
    const booksInfo = books.docs;
    booksInfo.forEach((book, index) => {
        if(book.cover_i){
            booksInfo[index]['imgUrl'] = `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`;
        }
        if(error){
            if(book.key === error.id){
                booksInfo[index]['error'] = error.message;
            }
        }

    });
    res.render('index.ejs', {
        books: booksInfo,
    });
});

// save book in database 
app.post('/save', async(req, res) => {
    const bookName = req.body.name;
    const bookImg = req.body.imageURL;
    const workId = req.body.workId;
    const bookKey = req.body.key;
    let bookNumberPages = 0;
    //get books page if there if coverI 
    if(bookKey){
        const bookPages = await bookInfo('books', bookKey);
        bookNumberPages = bookPages.number_of_pages;
    }
    //save data to data base name, url, review_note, pages
    const result = await addBook([bookName, bookImg, 0.0, bookNumberPages, workId], res);
    if(result){
        console.log('add book');
        res.redirect('/');
    }else{
        error = {
            message: 'Sorry this book is already added to the library',
            id: workId,
        }
        res.redirect('/');
    }
});

//view book more info 
app.get('/book/:bookId', async(req, res) => {
    
    res.render('book.ejs');

});

// function request search for a book 
async function searchBook(query, limit){
    
    // make url for search 
    const url = API_URL + `search.json?q=${query.replace(' ', '+')}&limit=${limit}`
    try{
        const response = await axios.get(url, {
            headers: headers
        });
        return response.data;
    }catch(error){
        console.log('Faile to make request:', error);
    }
}

//function request openlibrary 
async function bookInfo(endPoint, query){
    try{
        const response = await axios.get(
            `${API_URL}${endPoint}/${query}.json`, {
                headers: headers
            }
        );
        return response.data;
    }catch(error){
        console.log('Faile to make request:', error);
    }
    
} 

//save new book function 
async function addBook(data){
    try{
        const query = await db.query(
            "INSERT INTO books(name, url, review_note, pages, work_id) VALUES($1, $2, $3, $4, $5)", data
        );
        return true;
    }catch(err){
        console.log('Error executing query:', err);
    }
}


//start server 
app.listen(port, (erro) => {
    console.log(`Server is running at http://localhost:${port}`);
})
