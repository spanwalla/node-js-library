class Book {
    constructor(body) {
        this.title = body.title;
        this.description = body.description;
        this.authors = body.authors;
        if (typeof body.authors === "string") {
            this.authors = this.authors.split(',');
            this.authors = this.authors.map(s => s.trim());
        }
        this.releaseDate = body.releaseDate;
        this.thumbnail = body.thumbnail || "default";
        this.status = "in_stock";
        this.returnDate = "";
        this.givenTo = "";
    }
}

module.exports = Book;