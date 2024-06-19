'use strict';
const Thread = require('../models/threads').Thread
const Board = require('../models/board').Board
const Reply = require('../models/reply').Reply

module.exports = function (app) {
  
  app.route('/api/threads/:board')
    .post(async (req, res) => {
      let { text, delete_password } = req.body

      try {
        let newThread = new Thread({
          _id: new mongoose.Types.ObjectId(),
          text: req.body.text,
          password: req.body.delete_password,
          created_on: new Date(),
          bumped_on: new Date(),
          reported: false
        });
      } catch (err){
        res.send('Error in creating record')
      }

    })
    
  app.route('/api/replies/:board');

};
