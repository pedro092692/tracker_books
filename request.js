// imports 
import axios from 'axios';

// base api url
const API_URL = 'https://openlibrary.org/'

// required headers
const headers = {
    'User-Agent': "book_tracker_app/1.0 (pedro092692@gmail.com)"
}

// function request search for a book 
export async function searchBook(query, limit){
    
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
export async function bookInfo(endPoint, query){
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

// function get random book 
export async function randomBook(){
    try{
        const bookList = await bookInfo('people/mekBot/books', 'want-to-read');
        const randomBooks = []
        //get three randomBooks 
        for(var i = 0; i < 3; i++){
            const selectRandomBook = bookList.reading_log_entries[Math.floor(Math.random() * 100)];
            randomBooks.push({
                name: selectRandomBook.work.title,
                author: selectRandomBook.work.author_names[0],
                imgURL: `https://covers.openlibrary.org/b/id/${selectRandomBook.work.cover_id}-L.jpg`,
            });
        }
        
        return randomBooks;

        
    }catch(error){
        console.log('Faile to make request:', error);
    }
}