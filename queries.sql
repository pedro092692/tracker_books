-- Books table 

CREATE TABLE books (
    id integer NOT NULL,
    name text NOT NULL,
    url text NOT NULL,
    review_note double precision DEFAULT 0,
    pages integer,
    read boolean DEFAULT false,
    work_id character varying NOT NULL
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