var createError = require('http-errors')
var express = require('express')
var path = require('path')
var cookieParser = require('cookie-parser')
var parseurl = require('parseurl')
var session = require('express-session')
var RedisStore = require('connect-redis')(session)
var logger = require('morgan')

var indexRouter = require('./routes/index')
var usersRouter = require('./routes/users')

var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use(
  session({
    secret: '902843hg09238ghj0292!@#%@#^',
    resave: false,
    saveUninitialized: true,
    store: new RedisStore({
      host: 'localhost',
      port: 6379,
      prefix: 'obk',
      ttl: 1200, // seconds
      disableTTL: false,
      db: 10,
      scanCount: 32,
      unref: true
      // pass: 'secret'
    })
    // cookie: { maxAge: 3000 }
  })
)

const authData = {
  id: 'obk',
  pwd: '123',
  nickname: '홀리쉿!~'
}

app.post('/login', function(req, res, next) {
  const id = req.body.id
  const pwd = req.body.pwd

  console.log(req.body)

  if (authData.id === id && authData.pwd === pwd) {
    req.session.nickname = authData.nickname
    req.session.save(function(err) {
      res.send(`Hi ${authData.nickname}`)
    })
  } else {
    res.send('who are you?')
  }
})

app.get('/logout', function(req, res, next) {
  req.session.destroy(function(err) {
    res.send('destory success')
  })
})

module.exports = app
