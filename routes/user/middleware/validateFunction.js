const {body} = require('express-validator')

function middlewareFunction(){
return [
        body('username').trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
    body('email').isEmail().normalizeEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
]
}

module.exports = middlewareFunction