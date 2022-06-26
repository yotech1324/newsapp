const express = require('express')
const index = express()
const mutacheExpress = require('mustache-express')
const bodyParser = require('body-parser')
const pgp = require('pg-promise')()
const connectionString = "postgres://localhost:5432/newsdb"
const checkAuthorization = require('./authentication or middleware/Authorization')
const session = require('express-session')
const port = 3000

 db = pgp(connectionString, { passward: "yug" })
const indexRoutes = require('./routes/index')
const userRoutes = require('./routes/users')

//adding partials it includes viewengine part
const path = require('path')
const views_path = path.join(__dirname, '/views')
// registering or configuring view engine

index.engine('mustache', mutacheExpress(views_path + '/partials', '.mustache'))
index.set('views', views_path)
index.set('view engine', 'mustache')

// setup express routes
index.use('/',indexRoutes)
index.use('/users', checkAuthorization,userRoutes)

//localhost:3000/css/site.css
index.use('/css', express.static('css'))


index.use(session({
    secret: 'fjksdfks',
    resave: false,
    saveUninitialized: false
}))

index.use(bodyParser.urlencoded({ extended: false }))

// using locals which has a property that can make a property on every mustache page
index.use((req,res,next) => {
    req.locals.authenticated = req.session.user == null ? false: true
next()
})

index.listen(port, () => {
    console.log('server has started running on ' + port)
})