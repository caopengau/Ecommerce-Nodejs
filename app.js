const createError = require('http-errors');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const expressValidator = require('express-validator');//req.checkbody()
const mongoConfig = require('./configs/mongo-config');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const Department = require('./models/Department');

//mongodb://heroku_8bd94qrf:irstf0rv1ds970eebtislm0apf@ds029638.mlab.com:29638/heroku_8bd94qrf
mongoose.connect(mongoConfig, {useNewUrlParser: true, useCreateIndex: true,}, function (error) {
    if (error) throw error;
    console.log(`connect mongodb success`);
});
/* print the collections */
// let db = mongoose.connection;
// db.on('open', function (ref) {
//   console.log('Connected to mongo server.');
//   trying to get collection names
//   mongoose.connection.db.listCollections().toArray(function (err, names) {
//     console.log(names); // [{ name: 'dbname.myCollection' }]
//     module.exports.Collection = names;
//   });
// });

// db.once('open', function () {
//   db.db.collection("department", function(err, collection){
//     collection.find({}).toArray(function(err, data){
//       console.log(data); // it will print your collection data
//     })
//   });
// });

const app = express();
app.use(cors());

// Express validator
app.use(expressValidator({
    errorFormatter: function (param, msg, value) {
        const namespace = param.split('.');
        root = namespace.shift();
        let formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

//set static dir
app.use(express.static(path.join(__dirname, 'public')));

//routers
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // console.log(err);
    res.status(err.status || 500).json(err);
});

module.exports = app;
