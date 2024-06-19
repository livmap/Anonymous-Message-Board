'use strict';
require('dotenv').config()
const mongoose = require('mongoose')
const Board = require('../models/board').Board
const Reply = require('../models/reply').Reply

const uri = process.env.DB

mongoose.connect(uri)

const Schema = mongoose.Schema;

const threadSchema = new Schema({
  _id        : Schema.Types.ObjectId,
  text       : { type: String, required: true },
  password   : { type: String, required: true },
  created_on : { type: Date, default: Date.now },
  bumped_on  : { type: Date, default: Date.now },
  reported   : { type: Boolean, default: false },
  replies    : [{ type: Schema.Types.ObjectId, ref: 'Reply' }]
});

const Thread = mongoose.model('Thread', threadSchema)


module.exports = function (app) {
  
  app.route('/api/threads/:board')
    .post(async (req, res) => {
      let { text, delete_password } = req.body

      try {
        let newThread = new Thread({
          _id: new mongoose.Types.ObjectId(),
          text: text,
          password: delete_password,
          created_on: new Date(),
          bumped_on: new Date(),
          reported: false
        });

        newThread.save()
          .then((thread) => {
            console.log('Thread Added')
          })
        
      } catch (err){
        res.send('Error in creating record')
      }

    })
    
  app.route('/api/replies/:board');

};
