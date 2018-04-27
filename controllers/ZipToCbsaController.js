'use strict';

const express = require('express');
const router = express.Router();
const app = express();
const request = require("request");
const csv = require('csv-parser');
const Cbsa = require("../domain/Cbsa");

router.get('/:zipcode', (req, res) => {
  console.log("searching zipcode " + req.params.zipcode );
  queryForCbsa(req.params.zipcode, req, res);
});

const queryForCbsa = (zipcode, req, res) => {
  let query = req.app.locals.db.models.Cbsa.find({ "zip": zipcode });

  query.exec((err, cbsa) => {
    handleError(err, res);
    if(!!cbsa && cbsa.length > 0){
      let cbsaFromZip = cbsa[0].cbsa;
      queryForTrueCbsa(cbsaFromZip, req, res);
    }
    else {
      res.status(200).send({});
    }
  })  
}

const queryForTrueCbsa = (cbsaFromZip, req, res) => {
  let queryMsa = req.app.locals.db.models.Msa.find({ "mdiv": cbsaFromZip });

  queryMsa.exec((err, msa) => {
    handleError(err, res);
    let trueCbsa = !!msa[0].cbsa ? msa[0].cbsa : cbsaFromZip;
    queryForMsa(trueCbsa, req, res);
  });
}

const queryForMsa = (trueCbsa, req, res) => {
  let queryCensusData = req.app.locals.db.models.Msa.find({ "cbsa": trueCbsa, lsad: 'Metropolitan Statistical Area' });

  queryCensusData.exec((err, msa) => {
    handleError(err, res);
    let result = {
      zip: Number(req.params.zipcode),
      cbsa: msa[0].cbsa,
      msa: msa[0].name,
      popestimate2014: msa[0].popestimate2014,
      popestimate2015: msa[0].popestimate2015
    }

    res.status(200).send(result);
  });
}

const handleError = (err, res) => {
  if (err){
    res.status(200).send(err);
  }
}

module.exports = router;