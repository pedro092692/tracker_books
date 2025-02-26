// ------- PROJECT REQUIREMENTS  ------- \\

// Make tracks books app for review your favorites books and add notes 
// 1. Add new book for read. ✅ (add total pages and paged red show percent) ✅
// 2. Add score to read book. ✅
// 3. Add notes to a book once read books ✅
// 4. Sort books by score. ✅
// 5. Sort books by read and not reads. 
// 6. New books notes. ✅
// 7. Using this api to get books info https://openlibrary.org/dev/docs/api/covers ✅

//imports 
import express from 'express';
import bodyParser from 'body-parser';
import {searchBook, bookInfo, randomBook} from './request.js';
import {
            addBook, saveBookInfo, librarayBooks, 
            updateBook, updatePageBook, readBooks, 
            addReadPage, addBookNote, bookNotes,
            deleteBook, bookNote, editBookNote,
            deleteBookNote
        } from './db.js';


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
    error = undefined;
    const userBooks = await librarayBooks();

    const suggesBooks = await randomBook();
    
    res.render('index.ejs', {
        books: userBooks,
        suggestedBooks: suggesBooks,
        reqURL: '/'
    });
});

//user books view
app.get('/mybooks', async(req, res) => {
    let userBooks
    // check if there are books in database 
    if(Object.keys(req.query).length != 0){
        switch (req.query.filter){
            case 'noRead':
                userBooks = await librarayBooks('WHERE read = $1 ', [false]);
            break;

            case 'read':
                userBooks = await librarayBooks('WHERE read = $1 ', [true]);
            break;
            
            case 'review':
                userBooks = await librarayBooks('WHERE 1 = 1 ', [], 'review_note ', 'DESC');
            break;

            case 'name':
                userBooks = await librarayBooks('WHERE 1 = 1 ', [], 'name ', 'ASC');
            break;

            default:
                userBooks = await librarayBooks();
        }
    }else{
        userBooks = await librarayBooks();
    }
    res.render('user_books.ejs', {
        books: userBooks,
        filter: req.query.filter,
    })
});

// search book view
app.get('/search', async(req, res) => {
    const query = req.query.query;
    const books = await searchBook(query, 8);
    const booksInfo = books.docs;
    // add for each book cover url img 
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
        searchQuery: query,
    });
});

// save book in database 
app.post('/save', async(req, res) => {
    const searchQuery = req.body.searchQuery.replace(' ', '+');
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
    //save data to database name, url, review_note, pages
    const result = await addBook([bookName, bookImg, 0.0, bookNumberPages, workId]);
    if(result){
        res.redirect(`/book/${workId.split('/')[2]}`);
    }else{
        error = {
            message: 'Sorry this book is already added to the library',
            id: workId,
        }
        res.redirect('/' + `search?query=${searchQuery}`);
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
            bookDescription = moreInfo.description.value;
        }else{
            bookDescription = moreInfo.description;
        }
        // get book info from daba base 
        const result = await saveBookInfo(`/works/${bookId}`);
        const bookTitle = result[0].name;
        const bookImgURL = result[0].url;
        const bookPages = result[0].pages;
        const bookScore = result[0].review_note;

        //get book notes 
        const notes = await bookNotes(result[0].id);
        // render view 
        res.render('book.ejs', {
            name: bookTitle,
            imgURL: bookImgURL,
            pages: bookPages,
            description: bookDescription,
            score: bookScore,
            read: result[0].read,
            id: result[0].id,
            workId: bookId,
            pages_read: result[0].pages_read,
            notes: notes,
        });
    }else{
        res.sendStatus(404);
    }
});

//update book info 
app.post('/book/update', async(req, res) => {
    let read = false;
    
    if(req.body.read){
        read = true;
    }

    const result = await updateBook([req.body.bookId, req.body.pages, req.body.score, read]);
    if(result){
        res.redirect(`/book/${req.body.workId}`)
    }else{
        res.sendStatus(500);
    }
    
});

//add / update read pages of book 
app.post('/pages/read', async(req, res) => {
    // check if book already has read pages 
    const bookIsRead = await readBooks(req.body.bookId);
    if(bookIsRead.length > 0){
        //update number pagese
        const updatePage = await updatePageBook(req.body.bookId, req.body.nPages);
        res.redirect(`/book/${req.body.workId}`);
    }else{
        //insert number pages 
        const addPage = await addReadPage(req.body.bookId, req.body.nPages);
        res.redirect(`/book/${req.body.workId}`);
    }   
});

//add book note
app.post('/book/note', async(req, res) =>{

    const bookId = req.body.bookId;
    const workId = req.body.workId;
    const noteTitle = req.body.noteTitle;
    const page = parseInt(req.body.page);
    const note = req.body.note;
    const addNote = await addBookNote(bookId, note, page, noteTitle);
    if(addNote){
        res.redirect(`/book/${workId}`);
    }else{
        res.sendStatus(500);
    }
});

//delete book of the user library
app.post('/book/delete', async(req, res) =>{
    const bookId = req.body.bookId;
    const deleteLibraryBook = await deleteBook(bookId);
    if(deleteLibraryBook){
        res.redirect('/')
    }else{
        res.sendStatus(404);
    }
});

// book note view 
app.get('/book/notes/:noteId', async(req, res) =>{
    const noteId = req.params.noteId;
    const note = await bookNote(noteId);
    if(note.length > 0){
        res.render('note.ejs',{
            id: note[0].id,
            note: note[0].note,
            page: note[0].page_ref,
            title: note[0].title,
            book: note[0].name, 
            imgURL: note[0].url,
            workId: note[0].work_id,
        })
    }else{
        res.sendStatus(404);
    }
    
});

// edit book note 
app.post('/note/edit', async(req, res) => {
    const noteId = req.body.id; 
    const title = req.body.title; 
    const page = parseInt(req.body.page);
    const note = req.body.note;
    
    const edit = editBookNote(noteId, title, page, note.trim());
    if(edit){
        res.redirect(`/book/notes/${noteId}`);
    }else{
        res.sendStatus(500);
    }
}); 

//delete book note 
app.post('/book/note/delete', async(req, res) => {
    const noteId = req.body.id;
    const work_id = req.body.work_id;
    const deleteNote = deleteBookNote(noteId);
    if(deleteBook){
        res.redirect(`/book/${work_id}`);
    }else{
        res.sendStatus(500);
    }
});

// 404 Middleware 
app.use((req, res, next) =>{
    res.status(404).render('partials/404.ejs');
});

//start server 
app.listen(port, (error) => {
    console.log(`Server is running at http://localhost:${port}`);
})
