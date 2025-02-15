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
import axios from 'axios';
import pg from 'pg';


// set up app
const app = express();
const port = 3000;
const API_URL = 'https://openlibrary.org/'
const headers = {
    'User-Agent': "book_tracker_app/1.0 (pedro092692@gmail.com)"
}

//middlewere 
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:true}));


app.get('/', async(req, res) => {
    const books = await searchBook('ahorrar y ', 8);
    const booksInfo = books.docs;
    booksInfo.forEach((book, index) => {
        if(book.cover_i){
            booksInfo[index]['imgUrl'] = `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
        }
    });
    res.render('index.ejs', {
        books: booksInfo
    });
});

app.post('/save', async(req, res) => {
    const bookName = req.body.name;
    const bookImg = req.body.imageURL;
    const workId = req.body.workId;
    const bookKey = req.body.key;
    const bookNumberPages = 0;
    //get books page if there if coverI 
    if(bookKey){
        const bookPages = await bookInfo('books', bookKey);
        bookNumberPages = bookPages.number_of_pages;
    }
    //save data to data base
    
    res.sendStatus(200);

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


//start server 
app.listen(port, (erro) => {
    console.log(`Server is running at http://localhost:${port}`);
})
