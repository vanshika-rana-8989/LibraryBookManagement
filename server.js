
const express = require("express");

const app = express();
const PORT = 3000;

// Middleware to read JSON request bodies
app.use(express.json());

// In-memory library records
let books = [
    {
        id: 101,
        title: "Wings of Fire",
        author: "A.P.J. Abdul Kalam",
        genre: "Autobiography",
        publishedYear: 1999,
        available: true
    },
    {
        id: 102,
        title: "The Alchemist",
        author: "Paulo Coelho",
        genre: "Fiction",
        publishedYear: 1988,
        available: true
    },
    {
        id: 103,
        title: "Harry Potter",
        author: "J.K. Rowling",
        genre: "Fantasy",
        publishedYear: 1997,
        available: false
    }
];

// Generate unique numeric ID
let nextId = 104;

// Validate book data
function validateBook(book) {
    return (
        book &&
        typeof book.title === "string" &&
        book.title.trim() !== "" &&
        typeof book.author === "string" &&
        book.author.trim() !== "" &&
        typeof book.genre === "string" &&
        book.genre.trim() !== "" &&
        Number.isInteger(book.publishedYear) &&
        book.publishedYear > 0 &&
        typeof book.available === "boolean"
    );
}

// 1. GET all books
app.get("/api/books", (req, res) => {
    res.status(200).json(books);
});

// 2. POST a new book
app.post("/api/books", (req, res) => {
    const newBook = req.body;

    if (!validateBook(newBook)) {
        return res.status(400).json({
            message: "Invalid input. Please provide all required fields."
        });
    }

    const book = {
        id: nextId++,
        title: newBook.title.trim(),
        author: newBook.author.trim(),
        genre: newBook.genre.trim(),
        publishedYear: newBook.publishedYear,
        available: newBook.available
    };

    books.push(book);

    res.status(201).json({
        message: "Book added successfully",
        book: book
    });
});

// 3. FILTER books by author
// Keep this route BEFORE /api/books/:id
app.get("/api/books/filter", (req, res) => {
    const author = req.query.author;

    if (!author || author.trim() === "") {
        return res.status(400).json({
            message: "Please provide an author query parameter."
        });
    }

    const filteredBooks = books.filter(book =>
        book.author.toLowerCase().includes(author.trim().toLowerCase())
    );

    res.status(200).json(filteredBooks);
});

// 4. GET book by ID
app.get("/api/books/:id", (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            message: "Invalid book ID"
        });
    }

    const book = books.find(b => b.id === id);

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    res.status(200).json(book);
});

// 5. PUT - Update book by ID
app.put("/api/books/:id", (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            message: "Invalid book ID"
        });
    }

    const index = books.findIndex(b => b.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    const updatedData = req.body;

    if (!validateBook(updatedData)) {
        return res.status(400).json({
            message: "Invalid input. Please provide all required fields."
        });
    }

    books[index] = {
        id: id,
        title: updatedData.title.trim(),
        author: updatedData.author.trim(),
        genre: updatedData.genre.trim(),
        publishedYear: updatedData.publishedYear,
        available: updatedData.available
    };

    res.status(200).json({
        message: "Book updated successfully",
        book: books[index]
    });
});

// 6. DELETE book by ID
app.delete("/api/books/:id", (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            message: "Invalid book ID"
        });
    }

    const index = books.findIndex(b => b.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    const deletedBook = books.splice(index, 1)[0];

    res.status(200).json({
        message: "Book deleted successfully",
        book: deletedBook
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Library Book Management API running at http://localhost:${PORT}`);
});
