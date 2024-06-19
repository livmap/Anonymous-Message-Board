'use strict';
require('dotenv').config()
const mongoose = require('mongoose')

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

const replySchema = new Schema({
  _id        : Schema.Types.ObjectId,
  text       : { type: String, required: true, maxlength: 3000 },
  password   : { type: String, required: true, minlength: 4, maxlength: 15 },
  created_on : { type: Date, default: Date.now },
  reported   : { type: Boolean, default: false }
});

const Thread = mongoose.model('Thread', threadSchema)

const Reply = mongoose.model('Reply', replySchema)

module.exports = function (app) {
  
  app.route('/api/threads/:board')
    .post(async (req, res) => {
      let { text, delete_password, board } = req.body

      try {
        let newThread = new Thread({
          _id: new mongoose.Types.ObjectId(),
          text: text,
          password: delete_password,
          created_on: new Date(),
          bumped_on: new Date(),
          reported: false
        });

        const addThread = await newThread.save()
          .then((thread) => {
            console.log('Thread Added')
            res.redirect("/b/" + board)
          })
        
      } catch (err){
        res.send('Error in creating record')
      }

    })
    .get(async (req, res) => {
      try {
        const threads = await Thread.aggregate([
          { $sort: { bumped_on: -1 } },
          { $limit: 10 },
          {
            $project: {
              _id: 1,
              text: 1,
              created_on: 1,
              bumped_on: 1,
              replies: { $slice: ['$replies', 3] } // Limit `tags` array to 3 items
            }
          }
        ])

        console.log(res.json(threads))
      } catch(err){
        console.log('Error retrieving Threads')
      }
    })
    
  app.route('/api/replies/:board')
    .post(async (req, res) => {
      let { text, delete_password, thread_id } = req.body

      try {
        let newReply = new Reply({
          text: text,
          password: delete_password,
          created_on: new Date()
        })
  
        await newReply.save()
          .then(() => {
            console.log('Reply Added')
            res.redirect("/")
          })
      } catch (err){
        res.send('An error occured adding the reply')
      }
      

      let updatedThread = await new Thread.findByIdAndUpdate(thread_id, { $set: {bumped_on: new Date()}, $push: { replies: newReply } })



    })
    .get(async (req, res) => {
      const { thread_id } = req.query

      try {

        let incomingThread = await Thread.findById(thread_id).select('-reported -_id')
        res.json(incomingThread)

      } catch(err){
        res.send('Error: Thread was not found')
      }

    })

};
