const storage = require('../storage');
const Book = require("../models/Book");
const fs = require("fs");
const path = require("path");

let books = storage.getData('books.json');

function parseDate(dateStr) {
    if (!dateStr) return null; // Если дата пустая, возвращаем null

    const [day, month, year] = dateStr.split('.');
    return new Date(year, month - 1, day);
}

exports.getAllBooks = (req, res) => {
    res.status(200).json(Object.entries(books));
};

exports.getBook = (req, res) => {
    if (!books[req.params.bookId]) {
        return res.status(404).json({message: 'Book not found'});
    }
    res.status(200).json(books[req.params.bookId]);
}

exports.searchBooks = (req, res) => {
    const query = req.query.query;
    const in_stock = req.query.in_stock === "true";
    const order_by = req.query.order_by;

    const sorters = {
        "return_asc": function (a, b) {
            const dateA = parseDate(a[1].returnDate);
            const dateB = parseDate(b[1].returnDate);

            if (!dateA) return 1;
            if (!dateB) return -1;

            return dateA - dateB;
        },
        "return_desc": function(a, b) {
            const dateA = parseDate(a[1].returnDate);
            const dateB = parseDate(b[1].returnDate);

            if (!dateA) return 1;
            if (!dateB) return -1;

            return dateB - dateA;
        }
    };

    const searchRegex = query && query.length > 0 ? new RegExp(query, 'i') : /.*/;
    const results = Object.entries(books).filter(([id, item]) => {
        if (in_stock && item['status'] !== "in_stock") {
            return false;
        }
        return searchRegex.test(id) || ['title', 'authors', 'releaseDate', 'description'].some(field => searchRegex.test(item[field]));
    });

    if (order_by && order_by.length > 0 && sorters[order_by]) {
        results.sort(sorters[order_by]);
    }

    res.status(200).json(results);
}

exports.createBook = (req, res) => {
    const requiredFields = ['title', 'authors', 'releaseDate'];
    const missingFields = requiredFields.filter(field => !(field in req.body));
    if (missingFields.length > 0) {
        return res.status(400).json({message: `Missing required fields: ${missingFields.join(', ')}`});
    }

    const lastId = Math.max(...Object.keys(books)
        .map(key => parseInt(key))
        .filter(key => !isNaN(key)));

    const newBook = new Book(req.body);
    books[(lastId + 1).toString()] = newBook;
    res.status(201).json({id: (lastId + 1).toString(), data: newBook});
}

exports.editBook = (req, res) => {
    if (!books[req.params.bookId]) {
        return res.status(404).json({message: 'Book not found'});
    }

    for (const key in req.body) {
        if (books[req.params.bookId].hasOwnProperty(key)) {
            if (key === "authors") {
                let authors = req.body[key].split(',');
                authors = authors.map(s => s.trim());
                books[req.params.bookId][key] = authors;
            } else if (key === "returnDate" && req.body[key].length > 0) {
                const [year, month, day] = req.body[key].split('-');
                books[req.params.bookId][key] = `${day}.${month}.${year}`;
            } else if (key === "thumbnail") {
                books[req.params.bookId][key] = path.join('thumbnails', path.basename(req.body[key].path));
            } else {
                books[req.params.bookId][key] = req.body[key];
            }
        }
    }

    res.status(200).json(books[req.params.bookId]);
}

exports.deleteBook = (req, res) => {
    if (!books[req.params.bookId]) {
        return res.status(404).json({message: 'Book not found'});
    }

    books[req.params.bookId] = undefined;
    res.status(204).json();
}