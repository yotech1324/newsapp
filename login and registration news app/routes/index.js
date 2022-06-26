

// using express router
const express = require('express')
const bcrypt = require('bcrypt')
const salt_rounds = 10
const router = express.Router()


router.get('/',(req,res)=>{

    db.any('select articleid,title,body from articles')
    .then((articles) =>{
        res.render('index',{articles: articles})
    })
})

//  async and await function implementation
//   router.get('/', async (req,res)=>{

//    let articles = db.any('select articleid,title,body from articles')
//         res.render('index',{articles: articles})
//     })



router.get('/login', (req, res) => {
    res.render('login')
})

router.post('/login', (req, res) => {
    let username = req.body.username
    let passward = req.body.passward

    db.oneOrNone('select userid,username,passward from users_data where usernme = $1', [username])
        .then((user) => {
            if (user) {
                //check for user passward
                bcrypt.compare(passward, user.passward, function (error, result) {
                    if (result) {

                        // put username and user_id in the session 
                        if (req.session) {
                            req.session.user = { userid: user.userid, username: user.username }
                        }

                        res.redirect('/users/articles')
                    }
                    else {
                        res.render('login', { message: "Invalid usename or passward" })
                    }
                })
            }
            else {
                // user doesnot exist
                res.render('login', { message: "Invalid usename or passward" })
            }
        })
})

router.get('/register', (req, res) => {
    res.render('register')
})

router.post('/register', (req, res) => {
    let username = req.body.username
    let passward = req.body.passward

    db.oneOrNone('select userid from users_data where usernme = $1', [username])
        .then((user) => {
            if (user) {
                res.render('register', { message: "username alreay exist" })
            }
            else {
                // insert user into the users_data table
                bcrypt.hash(passward, salt_rounds, function (error, hash) {
                    if (error == null) {
                        db.none('insert into users_data(username,passward) values($1,$2)'[username, hash])
                            .then(() => {
                                res.send("success")
                            })
                    }
                })
            }
        })
})


router.get('/logout',(req,res,next) =>{
    if(req.session){
        req.session.destroy((error) => {
            if(error){
                next(error)
            }
            else{
                res.redirect('/login')
            }
        })
    }
})

module.exports = router