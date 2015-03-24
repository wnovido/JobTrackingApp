var express = require('express');
var app = express();
var cors = require("cors");
var fs = require('fs');
var morgan = require('morgan');  // log requests to the console (express4)
var bodyParser = require('body-parser'); // pull information from HTML POST (express4)
var mongoose = require ("mongoose");

// Here we find an appropriate database to connect to, defaulting to
// localhost if we don't find one.  
var uristring = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/JobHunt';

// Makes connection asynchronously.  Mongoose will queue up database
// operations and release them when the connection is complete.
mongoose.connect(uristring, function (err, res) {
  if (err) { 
    console.log ('ERROR connecting to: ' + uristring + '. ' + err);
  } else {
    console.log ('Succeeded connected to: ' + uristring);
  }
});


app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set("view options", {
  layout: false
});

app.use(express.static(__dirname + '/app'));
app.get('/', function(req, res) {
    res.render('app/index.html');
});


fs.readdirSync(__dirname + '/models').forEach(function(filename) {
    if (~filename.indexOf('.js')) require(__dirname + '/models/' + filename);
});

var JobHunt = mongoose.model('jobhunts');
var References = mongoose.model('references');





//** references
//**
// get all
app.get("/references", function (req, res) {
    References.find({Group: req.query.Group}).exec(function (err, reference) {
        res.send(reference);
    });
});


// add reference
app.post("/addReference", function (req, res) {
    var reference = new References({
        Group	:	req.body.Group,
        Name	:	req.body.Name
    });
    reference.save(function (err) {
        console.log(err);
        res.send(err);
    });
});


// delete reference
app.delete("/deleteReference/:_id", function(req, res) {
    References.findById(req.params._id, function (err, reference) {
        if (!reference) {
            res.statusCode = 404;
            console.log('ID Not Found');
            return res.send({error: 'Not found'});
        }

        reference.remove(function (err) {
            if (!err) {
                console.log('Removed status');
                return res.send({status: 'OK'});
            } else {
                res.statusCode = 500;
                console.log('Internal error(%d): %s', res.statusCode, err.message);
                return res.send({error: 'Server error'});
            }
        });
    });
});


// update reference
app.put("/updateReference/:_id", function(req, res) {
    References.findById(req.params._id, function (err, reference) {
        reference.Name = req.body.Name;

        reference.save(function (err) {
            if (!err) {
                console.log("updated");
            } else {
                console.log(err);
            }
            res.send(reference);
        });
    });
});







// jobhunt table model
// get all records
app.get("/jobhunts", function (req, res) {
    JobHunt.find().populate('company').populate('position').populate('source').populate('contact').populate('status').exec(function (err, jobhunts) {
        if (err)
            res.send(err);
        else
            res.send(jobhunts);
    });
});


// add job
app.post("/addJobhunt", function (req, res) {
    var dateApplied = req.body.dateApplied;
    var company = req.body.company;
    var position = req.body.position;
    var source = req.body.source;
    var contact = req.body.contact;
    var status = req.body.status;

    var jobhunt = new JobHunt({
        dateApplied	:	dateApplied,
        company		:	company,
        position	:	position,
        source		:	source,
        contact		:	contact,
        status		:	status
    });

    jobhunt.save(function (err) {
        res.send();
    });
});


// delete a job
app.delete("/deleteJobhunt/:_id", function(req, res) {
    JobHunt.findById(req.params._id, function (err, jobhunt) {
        if (!jobhunt) {
            res.statusCode = 404;
            console.log('ID Not Found');
            return res.send({error: 'Not found'});
        }

        jobhunt.remove(function (err) {
            if (!err) {
                console.log('Removed jobhunt');
                return res.send({status: 'OK'});
            } else {
                res.statusCode = 500;
                console.log('Internal error(%d): %s', res.statusCode, err.message);
                return res.send({error: 'Server error'});
            }
        });
    });
});


// update job
app.put("/updateJobhunt/:_id", function(req, res) {
    JobHunt.findById(req.params._id, function (err, jobhunt) {
        jobhunt.dateApplied = req.body.dateApplied;
        jobhunt.company = req.body.company;
        jobhunt.contact = req.body.contact;
        jobhunt.position = req.body.position;
        jobhunt.source = req.body.source;
        jobhunt.status = req.body.status;

        jobhunt.save(function (err) {
            if (!err) {
                console.log("updated");
            } else {
                console.log(err);
            }
            res.send(jobhunt);
        });
    });
});


// get job by id
app.get("/jobhunts/:_id", function (req, res) {
    JobHunt.findById(req.params._id, function (err, jobhunt) {
        if (err)
            res.send(err);
        else
            res.send(jobhunt);
    });
});





app.listen(process.env.PORT || 3000);