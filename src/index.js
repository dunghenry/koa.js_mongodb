const Koa = require('koa');
const { koaBody } = require('koa-body');
const morgan = require('koa-morgan');
const helmet = require('koa-helmet');
const dotenv = require('dotenv');
const cors = require('@koa/cors');
const connectDB = require('./configs/connect.db');
const port = process.env.PORT || 4000;
dotenv.config();
const isProduction = process.env.NODE_ENV === 'production';
const books = require('./routes/book.route');
const auth = require('./routes/auth.route');
const fs = require('fs');
const app = new Koa();
app.use(cors());
const accessLogStream = fs.createWriteStream(__dirname + '/logs/access.log', {
    flags: 'a',
});
app.use(koaBody());
app.use(
    isProduction
        ? morgan('combined', { stream: accessLogStream })
        : morgan('tiny'),
);
app.use(helmet());
(async () => {
    await connectDB();
})();
app.use(auth.routes()).use(auth.allowedMethods());
app.use(books.routes()).use(books.allowedMethods());
app.listen(port, () =>
    console.log(`Server listen on http://localhost:${port}`),
);
