const mongoose = require('mongoose');
const Reply    = require('./reply.js');
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

module.Thread = Thread