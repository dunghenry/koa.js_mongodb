const Book = require('../models/book.model');
const bookController = {
    getBooks: async (ctx, next) => {
        try {
            const books = await Book.find({});
            ctx.body = books;
            return;
        } catch (error) {
            ctx.response.status = 500;
            ctx.body = { message: error.message };
            return;
        }
    },
    createBook: async (ctx, next) => {
        const { name, author } = ctx.request.body;
        try {
            const book = await Book.findOne({ name });
            if (book) {
                ctx.response.status = 400;
                ctx.body = { message: 'Name already exists' };
            }
            const newBook = new Book({
                name,
                author,
            });
            const savedUser = await newBook.save();
            ctx.response.status = 201;
            ctx.body = savedUser;
            return;
        } catch (error) {
            ctx.response.status = 500;
            ctx.body = { message: error.message };
            return;
        }
    },
};

module.exports = bookController;
