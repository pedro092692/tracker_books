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
import {searchBook, bookInfo} from './request.js';
import {addBook, saveBookInfo, librarayBooks} from './db.js';



// set up app
const app = express();
const port = 3000;

// error 
let error;

//middlewere 
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));

//index view 
app.get('/', async(req, res) => {
    // check if there are books in database 
    const userBooks = await librarayBooks();
    console.log(userBooks);
    res.render('index.ejs', {
        books: userBooks,
    });
});


// search book view
app.post('/search', async(req, res) => {
    const query = req.body.query;
    const books = await searchBook(query, 8);
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
    res.render('search.ejs', {
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
    const bookId = req.params.bookId;
    let bookDescription = '';
    // get more info about book 
    const  moreInfo = await bookInfo('works', bookId);
    if(moreInfo){
        // get book description check if description if type object or string
        if(typeof(moreInfo.description) === 'object'){
            console.log(moreInfo.description);
            bookDescription = moreInfo.description.value;
        }else{
            bookDescription = moreInfo.description;
        }
        // get book info from daba base 
        const result = await saveBookInfo(`/works/${bookId}`);
        const bookTitle = result[0].name;
        const bookImgURL = result[0].url;
        const bookPages = result[0].pages;

        // render view 
        res.render('book.ejs', {
            name: bookTitle,
            imgURL: bookImgURL,
            pages: bookPages,
            description: bookDescription,
        });
    }else{
        res.sendStatus(404);
    }
});

//start server 
app.listen(port, (error) => {
    console.log(`Server is running at http://localhost:${port}`);
})
