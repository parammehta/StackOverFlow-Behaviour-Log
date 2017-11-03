// var behaviorService = require('./service/behaviorService');
var Behavior = require('./models/behavior');
var mongoose = require('mongoose');
module.exports = function(app, passport) {

    app.get('/', isLoggedOut, function(req, res) {
        res.render('index.ejs');
    });

    app.get('/login', isLoggedOut, function(req, res) {
        res.render('login.ejs', { message: req.flash('loginMessage') });
    });

    app.post('/login', isLoggedOut, passport.authenticate('local-login', {
        successRedirect: '/profile',
        failureRedirect: '/login',
        failureFlash: true
    }));

    app.get('/signup', isLoggedOut, function(req, res) {
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect: '/profile',
        failureRedirect: '/signup',
        failureFlash: true
    }));

    app.get('/profile', isLoggedIn, function(req, res) {
        res.cookie('useremail', req.user.local.email, { httpOnly: true });
        res.render('profile.ejs', {
            user: req.user
        });
    });


    app.get('/getLog', function(req, res) {

        mongoose.createConnection('mongodb://localhost:27017/awassignment1', function(err, db) {
            if (err) {
                console.log(err);
                throw err;
            }
            console.log(req.cookies.useremail);
            var id = req.cookies.useremail;
            Behavior.find({userId: id}, function (err, data) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(data);
                    res.render('log.ejs',{
                        userId: id,
                        data: data
                });
                }
            })
        });
    });

    app.get('/myVisualization', function(req, res) {

        mongoose.createConnection('mongodb://localhost:27017/awassignment1', function(err, db) {
            if (err) {
                console.log(err);
                throw err;
            }
            console.log(req.cookies.useremail);
            var id = req.cookies.useremail;
            Behavior.find({}, function (err, data) {
                if (err) {
                    console.log(err);
                } else {
                    res.render('personalViz.ejs',{
                        userId: id,
                        data: data
                    });
                }
            })
        });
    });
    app.get('/groupVisualization', function(req, res) {

        mongoose.createConnection('mongodb://localhost:27017/awassignment1', function(err, db) {
            if (err) {
                console.log(err);
                throw err;
            }
            console.log(req.cookies.useremail);
            var id = req.cookies.useremail;
            Behavior.find({}, function (err, data) {
                if (err) {
                    console.log(err);
                } else {
                    res.render('groupbar.ejs',{
                        userId: id,
                        data: data
                    });
                }
            })
        });
    });

    app.get('/getDashboard', function(req, res) {

        mongoose.createConnection('mongodb://localhost:27017/awassignment1', function(err, db) {
            if (err) {
                console.log(err);
                throw err;
            }
            console.log(req.cookies.useremail);
            var id = req.cookies.useremail;
            Behavior.find({}, function (err, data) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(data);
                    res.render('dashboard.ejs',{
                        userId: id,
                        data: data
                    });
                }
            })
        });
    });

    app.post('/behavior', function(req, res) {
        console.log(req.body);
        // console.log(req.body.timeStamp);
        if (req.cookies.useremail) {
            let type = req.body.url;
            let dateTime = req.body.timestamp;
            let data = req.body.activity;

            if(data === 'Tag_Click')
                type = "Tag name: " + req.body.tag;

            if (data === 'Suggest_Edit')
                type = "Improved Answer";

            if(data === 'Question_Link')
                type = req.body.question;

            if(data === 'Mouse_Movement')
                type = " On URL: " + req.body.url;

            if(data === 'Copy')
                type = "Copied Text: " + req.body.text; //Selected Text

            if(data === 'Bookmark')
                type = req.body.question;

            if(data === 'Unbookmark')
                type = req.body.question;

            if(data === 'Downvote')
                type = req.body.question;

            if(data === 'Upvote')
                type = req.body.question;

            const dat =  Behavior({
                type: type,
                dateTime: dateTime,
                data: data,
                userId: req.cookies.useremail
            });

            console.log(dat);

            dat.save(function (err, post) {
                if(err) {
                    console.log(err);
                } else {
                    res.send("Success");
                }
            })
        } else {
            res.send("Dav");
        }
        
    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.clearCookie('useremail');
        res.redirect('/');
    });

    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            return next();
        res.redirect('/');
    }

    function isLoggedOut(req, res, next) {
        if (!req.isAuthenticated())
            return next();
        res.redirect('/profile');
    }
}
