//TODO: to run the server type: nodemon server.js

require('dotenv').config(); // for .env file
const express = require("express"); // express module for routes
const session = require("express-session");
const fileUpload = require('express-fileupload');
const md5 = require('md5');
const mysql = require("mysql") // mysql database
const bodyParser = require("body-parser"); // for requestes parsing
const favicon = require('serve-favicon'); // for icon
const { NULL } = require('mysql/lib/protocol/constants/types');




const app = express();
app.set('views', __dirname + '/views/');
app.set('view engine', 'ejs');
app.use(fileUpload());
app.use(express.static("public"));
// app.use(express.static(path.join('public'))); // CSS location
// app.use(express.static(path.join('app'))); //js location

app.use(bodyParser.urlencoded({ extended: true }));
app.use(favicon(__dirname + '/public/images/favicon.png')); // favicon location

const oneDay = 1000 * 60 * 60 * 24;
app.use(session({
    secret: process.env.SKEY,
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false
}));

var app_session;

//? ---------------------------------------------< Database section >--------------------------------------------------------
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "ticketsystem",
    multipleStatements: true
});

db.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        console.log(new Date().toLocaleString() + ":: Database connected !")
    }
});



//? -------------------------------------------< End of Database Section >-------------------------------------------------------



//? ---------------------------------------------< Admin route section >-------------------------------------------------------
app.route("/control")
    .get(function (req, res) {
        app_session = req.session
        if (app_session.adminPermission) {
            res.redirect("admin")
        } else {
            res.render("control/admin_signIn", {
                error_msg: "",
                error_class: ""
            })
        }
    })
    .post(function (req, res) {
        app_session = req.session
        const VALUES = [
            md5(req.body.password + process.env.SALT),
            req.body.username
        ]
        let sql = "SELECT * FROM `team` WHERE `password`= ? AND email=?";
        db.query(sql, VALUES, (err, result) => {
            if (err) {
                console.log(err)
                display_failure_user(res, "ERROR! sign in failed!", "Database failed!", "", "")
                res.render("control/admin_signIn", {
                    error_msg: "ERROR!sign in failed please try again!",
                    error_class: ""
                })
            } else {
                if (result.length) {
                    app_session.admin_id = result[0].id
                    app_session.admin_name = result[0].name
                    app_session.userPermission = false
                    app_session.adminPermission = true
                    app_session.role = result[0].role
                    console.log(new Date().toLocaleString() + ":: admin logged in")
                    load_dashBoard(result[0].name, res)

                } else {
                    console.log(new Date().toLocaleString() + ":: admin sign in failed!")
                    console.log(VALUES)
                    res.render("control/admin_signIn", {
                        error_msg: "Username or Password is incorrect!!",
                        error_class: "error"
                    })
                }
            }
        })
    });


app.route("/admin_signout")
    .get(function (req, res) {
        res.redirect("admin")
    })
    .post(function (req, res) {
        req.session.destroy((err) => {
            if (err) {
                return console.log(err);
            }
            console.log(new Date().toLocaleString() + ":: admin logged out")
            res.redirect('/control');
        });
    });


app.route("/admin")
    .get(function (req, res) {
        app_session = req.session
        if (app_session.adminPermission) {
            load_dashBoard(app_session.admin_name, res);
        } else { res.redirect("control") }
    })
    .post(function (req, res) {
        app_session = req.session
        if (app_session.adminPermission) {
            let menu_btn = req.body.control_btn;
            let sql = ""
            switch (menu_btn) {

                case "dashboard":
                    load_dashBoard(app_session.admin_name, res);
                    break;

                case "all_dev":
                    sql = "SELECT * FROM team;";
                    db.query(sql, (err, result) => {
                        if (err) {
                            console.log(err)
                            display_failure(res, "ERROR! failed to load data!", "Database failed!", err.sqlMessage, app_session.admin_id)
                        } else {
                            res.render("control/all_dev", {
                                admin: app_session.admin_id,
                                allDev: result,
                                role:app_session.role
                            })
                        }
                    })
                    break;

                case "add_dev":
                    res.render("control/add_admin", {
                        admin: app_session.admin_id,
                        role:app_session.role
                    })
                    break;

            }
        } else {
            res.redirect("control")
        }
    });



app.route("/add")
    .get(function (req, res) {
        res.redirect("control")
    })
    .post(function (req, res) {
        app_session = req.session
        if (app_session.adminPermission) {
            let sql = ""
            let VALUES
            let dates
            switch (req.body.control_btn) {
                case "add_dev":
                    VALUES = [
                        req.body.name,
                        req.body.email,
                        md5(req.body.password + process.env.SALT),
                        req.body.role
                    ]
                    sql = "INSERT INTO team (name,email,password,role) VALUES (?)";
                    db.query(sql, [VALUES], (err, result) => {
                        if (err) {
                            console.log(err)
                            display_failure(res, "ERROR! new Admin can not be added !", err.sqlMessage, "", app_session.admin_id)
                        } else {
                            console.log("NEW admin added to the system!")
                            console.log(VALUES)
                            display_success(res, "New Admin was added successfully!", "", "", app_session.admin_id)
                        }
                    })
                    break;
            }

        } else {
            res.redirect("control")
        }
    });



app.route("/search")
    .post(function (req, res) {
        app_session = req.session
        if (app_session.adminPermission) {
            let ac_VALUES = []
            let fmessage = ""
            let rec_VALUES
            let sql = ""

            switch (req.body.search_btn) {

                case "admin_search":

                    rec_VALUES = {
                        date_from: req.body.date_from,
                        date_to: req.body.date_to,
                    }
                    sql = "SELECT * FROM tickets AS T "
                    
                    if (rec_VALUES.date_from) {
                        ac_VALUES.push(rec_VALUES.date_from)
                        if (rec_VALUES.date_to) {
                            sql += " WHERE T.created BETWEEN ? AND ?;"
                            ac_VALUES.push(rec_VALUES.date_to)
                        } else {
                            sql += " WHERE T.created =?;"
                        }
                    }
                    db.query(sql, ac_VALUES, (err, result) => {
                        if (err) {
                            console.log(err)
                            display_failure(res, "ERROR! Search failed!", err.sqlMessage, "", 0)
                        } else {
                            if (result.length) {
                                fmessage = ""
                            }
                            else {
                                fmessage = "No results"
                            }
                            res.render("control/dashboard", {
                                team_mem_name: app_session.admin_name,
                                tickets: result,
                                role: app_session.role,
                                search_message:fmessage
                            })
                        }
                    })
                    break;

            }
        } else {
            res.redirect("control")
        }
    })
//? -------------------------------------------< End of Admin route section >-------------------------------------------------




//? ---------------------------------------------< Root route section >--------------------------------------------------------
app.route("/")
    .get(function (req, res) {
        res.redirect("/main")

    })
    .post(function (req, res) {
    });
//? ---------------------------------------------< End of root route section >---------------------------------------------------




//? ---------------------------------------------< customer Sign in/up/out route section >-------------------------------------------------------
app.route("/signin")
    .get(function (req, res) {
        app_session = req.session
        if (app_session.userPermission) {
            res.redirect("profile")
        }
        else {
            res.render("signIn")
        }

    })
    .post(function (req, res) {
        app_session = req.session
        const VALUES = [
            req.body.username,
            md5(req.body.password + process.env.SALT)
        ]
        sql = "SELECT * FROM `customers` WHERE email=? AND `password`=?";
        db.query(sql, VALUES, (err, result) => {
            if (err) {
                console.log(err)
                display_failure_user(res, "ERROR! sign in failed!", "Please try again later!", "", "")
            } else {
                if (result.length) {
                    app_session.user_id = result[0].id
                    app_session.user_name = result[0].name
                    app_session.userPermission = true
                    app_session.adminPermission = false
                    app_session.role = "User"
                    console.log(new Date().toLocaleString() + ":: user logged in")
                    res.redirect("main")
                } else {
                    console.log(new Date().toLocaleString() + ":: sign in failed!")
                    res.redirect("/signin")
                }
            }
        })
    });

app.route("/signup")
    .get(function (req, res) {
        res.render("signUp")
    })
    .post(function (req, res) {
        const VALUES = [
            null
            , req.body.name
            , req.body.email
            , md5(req.body.password + process.env.SALT)
        ]
        sql = "SELECT email FROM customers WHERE email=?";
        db.query(sql, req.body.email, (err, result) => {
            if (err) {
                console.log(err)
                display_failure_user(res, "ERROR! sign up failed!", "Please check your information", "", "")
            } else {
                if (result.length) {
                    console.log(err)
                    display_failure_user(res, "ERROR! can not sign up!", "This email already exist!", "", "")
                }
                else {
                    sql = "INSERT INTO customers VALUES (?)";
                    db.query(sql, [VALUES], (err, result) => {
                        if (err) {
                            console.log(err)
                            display_failure_user(res, "ERROR! sign up failed!", "Please try again later!", "", "")
                        } else {
                            console.log(new Date().toLocaleString() + ":: NEW customer added to the system!")
                            console.log(VALUES)
                            res.redirect("/signin")
                        }
                    })
                }
            }
        })
    });

app.route("/signout")
    .get(function (req, res) {
        res.redirect('/main');
    })
    .post(function (req, res) {
        req.session.destroy((err) => {
            if (err) {
                return console.log(err);
            }
            console.log(new Date().toLocaleString() + ":: user logged out")
            res.redirect('/main');
        });
    })
//? ---------------------------------------< End of customer Sign in/up/out route section >-------------------------------------------------------


//? ---------------------------------------------< Main route section >-------------------------------------------------------
app.route("/main")
    .get(function (req, res) {
        app_session = req.session
        sql = "SELECT * FROM tickets ORDER BY status";
        db.query(sql, (err, result) => {
            if (err) {
                console.log(err)
                display_failure_user(res, "ERROR! can not load the page now!", "Try again later", "", "")
            } else {
                console.log(result)
                if (app_session.userPermission) {
                    res.render("main", {
                        tickets: result,
                        search_message:""
                    })
                }
                else {
                    res.redirect("signin")
                }
            }
        })

    })
    .post(function (req, res) {
    });




app.route("/overview")
    .get(function (req, res) {
        res.redirect("main");
    })
    .post(function (req, res) {
        const VALUE = req.body.ticket_id_btn

        let sql = "SELECT * FROM tickets AS T LEFT JOIN tickets_comments AS TC ON TC.ticket_id=T.id WHERE T.id= ?";
        db.query(sql, VALUE, (err, result) => {
            if (err) {
                console.log(err)
                display_failure_user(res, "ERROR! can not view this ticket now!", "Try again later", "", "")
            } else {
                res.render("tickets/ticket_overview", {
                    ticket: result,
                    login_user_name: app_session.user_name,
                    login_user_id: app_session.user_id,
                    admin_session: false
                })
            }
        })
    });



app.route("/adminOverview")
    .get(function (req, res) {
        res.redirect("main");
    })
    .post(function (req, res) {
        const VALUE = req.body.ticket_id_btn

        let sql = "SELECT * FROM tickets AS T LEFT JOIN tickets_comments AS TC ON TC.ticket_id=T.id WHERE T.id= ?";
        db.query(sql, VALUE, (err, result) => {
            if (err) {
                console.log(err)
                display_failure_user(res, "ERROR! can not view this ticket now!", "Try again later", "", "")
            } else {
                res.render("tickets/ticket_overview", {
                    ticket: result,
                    login_user_name: app_session.admin_name,
                    login_user_id: app_session.admin_id,
                    admin_session: true
                })
            }
        })
    });


app.route("/ticketAction")
    .get(function (req, res) {
        res.redirect("control");
    })
    .post(function (req, res) {
        let VALUE = [
            app_session.admin_id,
            req.body.ticket_id
        ]
        let sql
        if (req.body.resolve) {
            VALUE.unshift(new Date())
            sql = "UPDATE tickets SET status = 'resolved', resolved=?, assignee=? WHERE id = ?;";
        }
        else if (req.body.assign) {
            sql = "UPDATE tickets SET status = 'assigned',assignee=? WHERE id = ?;";
        } else {
            res.redirect("control");
        }
        db.query(sql, VALUE, (err, result) => {
            if (err) {
                console.log(err)
                display_failure_user(res, "ERROR! can not view this ticket now!", "Try again later", "", "")
            } else {
                res.redirect("control");
            }
        })
    });


app.route("/comment")
    .get(function (req, res) {
        res.redirect("main");
    })
    .post(function (req, res) {
        app_session = req.session
        if (!app_session.userPermission && !app_session.adminPermission) {
            res.redirect("main")
        }

        let admin_comment
        if (app_session.userPermission) {
            admin_comment = false
        } else {
            admin_comment = true
        }

        const VALUE = [
            req.body.ticket_id,
            req.body.comment,
            req.body.comment_owner,
            new Date(),
            app_session.role
        ]
        console.log(VALUE)

        console.log(VALUE)
        let sql = "INSERT INTO `tickets_comments`( `ticket_id`, `comment`, `owner`, `com_created`, `role`) VALUES (?)";
        db.query(sql, [VALUE], (err, result) => {
            if (err) {
                console.log(err)
                display_failure_user(res, "ERROR! can not add comments now!", "Try again later", "", "")
            } else {
                let sql = "SELECT * FROM tickets AS T LEFT JOIN tickets_comments AS TC ON TC.ticket_id=T.id WHERE T.id= ?";
                db.query(sql, req.body.ticket_id, (err, result) => {
                    if (err) {
                        console.log(err)
                        display_failure_user(res, "ERROR! can not view this ticket now!", "Try again later", "", "")
                    } else {

                        res.render("tickets/ticket_overview", {
                            ticket: result,
                            login_user_name: app_session.user_name,
                            login_user_id: app_session.user_id,
                            admin_session: admin_comment
                        })
                    }
                })
            }
        })
    });


app.route("/addTicket")
    .get(function (req, res) {
        if (app_session.userPermission) {
            res.render("tickets/add_ticket")
        } else {
            res.redirect("main")
        }
    })
    .post(function (req, res) {
        if (app_session.userPermission) {
            let VALUES = [
                req.body.title,
                req.body.msg,
                app_session.user_id,
                new Date(),
                "open",
                0
            ]
            let sql = "INSERT INTO tickets( title, msg, cust_id, created, status, assignee) VALUES (?);";
            
            db.query(sql, [VALUES], (err, result) => {
                if (err) {
                    console.log(err)
                    display_failure_user(res, "ERROR! can not add this ticket now!", "Try again later", "", "")
                } else {
                    res.redirect("main");
                }
            })
        }
    });


app.route("/filters")
    .get(function (req, res) {
        res.redirect("main")
    })
    .post(function (req, res) {
        if(app_session.userPermission){

        let rec_VALUES = {
                ticket_title: req.body.ticket_title,
                date_from: req.body.date_from,
                date_to: req.body.date_to,
            }

        let ac_VALUES = []
        let fmessage = ""

        let sql = "SELECT * FROM tickets AS T "
        
        if (rec_VALUES.ticket_title) {
                sql += "WHERE T.title=? "
                ac_VALUES.push(rec_VALUES.ticket_title)
        }

        if (rec_VALUES.date_from) {
            if (rec_VALUES.ticket_title){
                sql += "AND "
            }else{
                sql += "WHERE "
            }
            ac_VALUES.push(rec_VALUES.date_from)
            if (rec_VALUES.date_to) {
                sql += "T.created BETWEEN ? AND ?;"
                ac_VALUES.push(rec_VALUES.date_to)
            } else {
                sql += "T.created =?;"
            }
        }

        db.query(sql, ac_VALUES, (err, results) => {
            if (err) {
                console.log(err)
                display_failure_user(res, "ERROR! can not search now!", "Try again later", "", "")
            } else {
                if (results.length === 0) {
                    fmessage = "No results"
                }

                    res.render("main", {
                        tickets: results,
                        search_message:fmessage
                    })
                
            }
        })
    }
})


//? ---------------------------------------------< End of Main route section >-------------------------------------------------------

//? ---------------------------------------------< Profile route section >-------------------------------------------------------


//? ---------------------------------------------< End of profile route section >-------------------------------------------------------



//? ---------------------------------------------< 404 route section >-------------------------------------------------------
app.get('*', function (req, res) {
    res.status(404).send('404 Not Found');
});
//? ---------------------------------------------< End of 404 route section >------------------------------------------------


//?---------------------------------------------< functions section >------------------------------------------------

function load_dashBoard(team_mem_name, res) {

    let sql = "SELECT * FROM tickets ORDER BY created DESC;"


    db.query(sql, (err, result) => {
        if (err) {
            console.log(err)
            display_failure(res, "ERROR! failed to load data!", "Database failed!", err.sqlMessage, team_mem_name)
        } else {

            res.render("control/dashboard", {
                team_mem_name: team_mem_name,
                tickets: result,
                role: app_session.role,
                search_message:""
            })
        }
    })
}


function display_failure(res, msg1, msg2, msg3, team_mem_name) {
    res.render("control/failure", {
        message1: msg1,
        message2: msg2,
        message3: msg3,
        admin: team_mem_name
    })
}


function display_success(res, msg1, msg2, msg3, team_mem_name) {
    res.render("control/success", {
        message1: msg1,
        message2: msg2,
        message3: msg3,
        admin: team_mem_name
    })
}


function display_success_user(res, msg1, msg2, msg3) {
    res.render("success", {
        messge1: msg1
        , messge2: msg2
        , messge3: msg3
    })
}


function display_failure_user(res, msg1, msg2, msg3) {
    res.render("failure", {
        messge1: msg1
        , messge2: msg2
        , messge3: msg3
    })
}


//?---------------------------------------------< end offunctions section >------------------------------------------------
//? ---------------------------------------------< ------------- >-------------------------------------------------------

app.listen(process.env.PORT || 3000, function () {
    console.log(new Date().toLocaleString() + ":: Server started..")
})
