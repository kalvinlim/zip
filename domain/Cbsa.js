'use strict';
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const CbsaSchema = new Schema({
  cbsa: Number,
  zip: Number,
  resRatio: Number,
  busRatio : Number,
  othRatio : Number,
  totRatio : Number
})

module.exports = mongoose.model("Cbsa", CbsaSchema, 'cbsa');