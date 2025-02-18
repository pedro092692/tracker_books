import pg from 'pg';

// database 
const db = new pg.Client({
    user: 'postgres', 
    host: 'localhost',
    database: 'library',
    password: '12345678',
    port: 5432,
});

// connect data base
db.connect();

//save new book function 
export async function addBook(data){
    try{
        const query = await db.query(
            "INSERT INTO books(name, url, review_note, pages, work_id) VALUES($1, $2, $3, $4, $5)", data
        );
        return true;
    }catch(err){
        console.log('Error executing query:', err);
    }
}

// read book function  
export async function saveBookInfo(bookId){
    try{
        const query = await db.query('SELECT books.*, COALESCE(percent_read.pages_read, 0) AS pages_read ' +
            'FROM books ' +
            'LEFT JOIN percent_read ON percent_read.book_id = books.id ' +
            'WHERE work_id = $1', [bookId]);
        return query.rows;
    }catch(err){
        console.log('Error executing query:', err);
    }
}

// list library added books
export async function librarayBooks(){
    try{
        const query = await db.query('SELECT books.*, COALESCE(percent_read.pages_read, 0) AS pages_read ' + 
            'FROM books ' +
            'LEFT JOIN percent_read ON percent_read.book_id = books.id ' +
            'ORDER BY review_note DESC');
        return query.rows;
    }catch(err){
        console.log('Error executing query:', err);
    }
}

//update book 
export async function updateBook(data){
    try{
        const query = await db.query('UPDATE books SET review_note = $3, pages = $2, read = $4 WHERE id = $1', data);
        return query.rows;
    }catch(err){
        console.log('Error executing query:', err);
    }
}

//check for pages read book 
export async function readBooks(bookId){
    try{
        const query = await db.query('SELECT * FROM percent_read WHERE book_id = $1', [bookId]);
        return query.rows;
    }catch(err){
        console.log('Error executing query:', err);
    }
}

//insert new pages read 
export async function addReadPage(bookId, page){
    try{
        const query = await db.query('INSERT INTO percent_read(book_id, pages_read) VALUES($1, $2)', [bookId, page]);
        return query.rows;
    }catch(err){
        consoele.log('Error executing query:', err);
    }
}

//update pages read of book 
export async function updatePageBook(bookId, page){
    try{
        const query = await db.query('UPDATE percent_read SET pages_read  = $1 WHERE book_id = $2', [page, bookId]);
        return query.rows;
    }catch(err){
        console.log('Error executing query:', err);
    }
}

//add new note to a book 
export async function addBookNote(bookId, note, page, title){
    try{
        const query = await db.query("INSERT INTO book_notes(book_id, note, page_ref, date, title) VALUES($1, $2, $3, $4, $5)", 
            [bookId, note, page, new Date(), title]
        );
        return query.rows;
    }catch(err){
        console.log('Error executing query:', err);
    }
}

// list books notes 
export async function bookNotes(bookId){
    try{
        const query = await db.query("SELECT * FROM book_notes WHERE book_id = $1 ORDER BY id DESC", [bookId]);
        return query.rows;
    }catch(err){
        console.log('Error executing query:', err);
    }
}

// delete book from library 
export async function deleteBook(bookId){
    try{
        const query = await db.query("DELETE FROM books WHERE id = $1", [bookId]);
        return true;
    }catch(err){
        console.log('Error executing query:', err);
    }
}