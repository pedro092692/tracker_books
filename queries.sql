-- Book table 

CREATE TABLE books(
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    review_note FLOAT DEFAULT 0, 
    pages INT, 
    read BOOLEAN DEFAULT false
);

-- read percent table 

CREATE TABLE percent_read(
    id SERIAL PRIMARY KEY, 
    book_id INT NOT NULL, 
    pages_read INT NOT NULL,
    FOREIGN KEY (book_id) REFERENCES books(id)
    ON DELETE CASCADE
);

-- book notes table 

CREATE TABLE book_notes(
    id SERIAL PRIMARY KEY,
    book_id INT, 
    note TEXT, 
    page_ref INT,
    FOREIGN KEY (book_id) REFERENCES books(id)
    ON DELETE CASCADE
);