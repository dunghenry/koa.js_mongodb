const Router = require('@koa/router');
const authController = require('../controllers/auth.controller');
const router = new Router({
    prefix: '/api/auth',
});
router.post('/register', authController.register);
router.post('/login', authController.login);
module.exports = router;
