const notesCtrl = {};
const Note = require("../models/Note");
const moment = require('moment');
var async = require("async");
const User = require('../models/User');
notesCtrl.renderNoteForm = (req, res) => {
  res.render("notes/new-note");
};
notesCtrl.createNewNote = (req, res) => {
  const { title, description } = req.body;
  const errors = [];
  if (!title || !description) {
    errors.push({ text: "Please fill all fields." });
  }
  if (errors.length > 0) {
    res.render("notes/new-note", {
      errors,
      title,
      description
    });
  }
  else {
    const newNote = new Note({ title, description });
    newNote.user = req.user.id;
    newNote.save()
      .then(notes => {
        req.flash("success_msg", "Note Added Successfully");
        res.redirect("/notes");
      }).catch(err => {
        res.redirect("/notes");
      });
  }
};
notesCtrl.renderNotes = (req, res) => {
  Note.find({user:req.user.id}).lean()
    .then(notes => {
      notes.forEach(function (item) {
        var date = moment(item.createdAt, "YYYYMMDD").fromNow();
        item.date = date
      });
      res.render("notes/all-notes", { notes });
    }).catch(err => {
      res.status(500).send({
        message: err.message
      });
    });
};
notesCtrl.renderEditForm = (req, res) => {
  async.waterfall([
    (callback) => { return callback(null, req.params); },
    myFirstFunction,
    mySecondFunction
  ], function (err, result) {
    res.render("notes/edit-note", { notes: result });
  });

};

notesCtrl.updateNote = (req, res) => {
  const { title, description, userid } = req.body;
  let obj = {
    "$addToSet": { "contributor": { "$each": [userid] } },
    "$set": {
      title, description
    }
  }
  Note.findByIdAndUpdate(req.params.id, obj).lean()
    .then(note => {
      req.flash("success_msg", "Note Updated Successfully");
      res.redirect("/notes");
    }).catch(err => {
      req.flash("success_msg", "Note Updated Failed");
      return res.redirect("/notes");
    });
};
notesCtrl.deleteNote = (req, res) => {
  Note.findByIdAndDelete(req.params.id).lean()
    .then(note => {
      req.flash("success_msg", "Note Deleted Successfully");
      res.redirect("/notes");
    }).catch(err => {
      req.flash("success_msg", "Note Deleted Failed");
      return res.redirect("/notes");
    });
};
notesCtrl.updateStatus = (req, res) => {
  // const { title, description } = req.body;
  Note.findByIdAndUpdate(req.params.id, { status: true }).lean()
    .then(note => {
      req.flash("success_msg", "Note Updated Successfully");
      res.redirect("/notes");
    }).catch(err => {
      req.flash("success_msg", "Note Updated Failed");
      return res.redirect("/notes");
    });
};
function myFirstFunction(data, callback) {
  Note.findById({ _id: data.id }).lean()
    .then(note => {
      callback(null, note)
    }).catch(err => {
      callback(null, [])
    });
}
function mySecondFunction(data, callback) {
  User.find({}, { name: 1 }).limit(10).lean()
    .then(users => {
      let obj = {
        note: data,
        user: users
      }
      callback(null, obj)
    }).catch(err => {
      let obj = {
        note: data,
        user: users
      }
      callback(null, obj)
    });
}
notesCtrl.renderNotesgrids = (req, res) => {
  Note.find({user:req.user.id}).lean()
    .then(notes => {
      var temp=[]
      notes.forEach(function (item) {
        let obj={}
        var date = moment(item.createdAt, "YYYYMMDD").fromNow();
        item.date = date
        obj={
          title:item.title,
          description:item.description,
          Created:item.date
        }
        temp.push(obj)
      });
     temp=JSON.stringify(temp)
      res.render("notes/notesgrids", { temp });
    }).catch(err => {
      res.status(500).send({
        message: err.message
      });
    });
};
notesCtrl.renderNotesNetwork = (req, res) => {
  Note.find({ user: req.user.id }).lean()
    .then(notes => {
      var temp = []
      var c = 0;
      notes.forEach(function (item) {
        c += 1
        let obj = {}
        obj = {
          label: item.title,
          id: c,
          
          arrows: 'to, from'
        }
        temp.push(obj)
      });
      var count = 0
      if (temp.length) {
        count = temp.length + 1
        let obj = {
          label: "User Tasks",
          id: count
        }
        temp.push(obj)
      }
      let Edge = [];
      temp.forEach(function (item) {
        let obj = {};
        if (count != item.id) {
          obj = {
            from: count,
            to: item.id
          }
          Edge.push(obj);
        }
      });

      temp = JSON.stringify(temp)
      Edge = JSON.stringify(Edge)

      res.render("notes/notesnetwork", { temp, Edge });
    }).catch(err => {
      res.status(500).send({
        message: err.message
      });
    });
}; 
notesCtrl.findeNote = (req, res) => {
  Note.findById(req.params.id, obj).lean()
    .then(note => {
      res.send(note);
    }).catch(err => {
      req.flash("success_msg", "Note Updated Failed");
      return res.redirect("/notes");
    });
};
module.exports = notesCtrl;


