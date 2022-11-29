const Router = require('@koa/router');
const bookController = require('../controllers/book.controller');
const jwt = require('jsonwebtoken');
const { verifyToken } = require('../middleware/verifyToken');
const router = new Router({
    prefix: '/books',
});
// router.get(
//     '/',
//     async (ctx, next) => {
//         const token = ctx.headers.token;
//         if (token) {
//             const accessToken = token.split(' ')[1];
//             if (!accessToken) {
//                 ctx.response.status = 404;
//                 ctx.body = { message: 'Token not found!' };
//                 return;
//             } else {
//                 let decoded;
//                 jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
//                     if (error?.name === 'TokenExpiredError') {
//                         ctx.response.status = 403;
//                         ctx.body = { message: 'Token is expired!' };
//                         return;
//                     } else if (error) {
//                         ctx.response.status = 403;
//                         ctx.body = { message: 'Token is not valid!' };
//                         return;
//                     } else {
//                         decoded = user;
//                     }
//                 });
//                 if (decoded?.userId) {
//                     await next();
//                 }
//             }
//         } else {
//             ctx.response.status = 401;
//             ctx.body = { message: "You're not authenticated" };
//             return;
//         }
//     },
//     bookController.getBooks,
// );
router.get(
    '/',
    async (ctx, next) => {
        await verifyToken(ctx, next);
    },
    bookController.getBooks,
);
router.post(
    '/',
    // async (ctx, next) => {
    //     await verifyToken(ctx, next);
    // },
    bookController.createBook,
);
module.exports = router;
