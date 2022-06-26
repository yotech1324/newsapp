// using express router
const express = require('express')
const router = express.Router()



router.post('/delete-article', (req, res) => {
    let articleid = req.body.articleid
    db.none('delete from articles where articleid = $1', [articleid])
        .then(() => {
            res.redirect('/users/articles')
        })
})

router.get('/add-article', (req, res) => {
    res.render('add-article')
})

router.post('/add-articles', (req, res) => {
    let title = req.body.title
    let description = req.body.description
    let userid = req.session.user.userid

    db.none('insert into articles(title,body,userid) values($1,$2,$3)'[title, description, userid])
        .then(() => {
            res.send("success")
        })
})


router.post('/update-article', (req, res) => {
    let title = req.body.title
    let description = req.body.description
    let articleid = req.body.articleid
    db.none('update articles set title =$1, body = $2 where articleid = $3', [title, description, articleid])
        .then(() => {
            res.redirect('/users/articles')
        })
})


router.get('/articles/edit/:articleid', (req, res) => {
    let articleid = req.params.articleid
    db.one('select articlid,title,body from articles where articleid = $1'[articleid])
        .then((article) => {
            res.render('edit-article', article)
        })
})


router.get('/articles', (req, res) => {
    // make it commented when database get coonected
    res.render('articles')
    // make it comment out after connect to database
    //     let userid = req.session.user.userid
    //     db.any('select atricleid,title,body from articles where userid = $1',[userid])
    //     .then((articles)=>{
    //         res.render('articles',{articles: articles})
    //     })

})


module.exports = router