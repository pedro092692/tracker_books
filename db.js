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
        const query = await db.query('SELECT * FROM books WHERE work_id = $1', [bookId]);
        return query.rows;
    }catch(err){
        console.log('Error executing query:', err);
    }
}

// list library added books
export async function librarayBooks(){
    try{
        const query = await db.query('SELECT * FROM books ORDER BY review_note DESC');
        return query.rows;
    }catch(err){
        console.log('Error executing query:', err);
    }
}