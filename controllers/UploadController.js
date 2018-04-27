'use strict';

const express = require('express');
const router = express.Router();
const app = express();
const request = require("request");
const csv = require('csv-parser');
const Cbsa = require("../domain/Cbsa");
const Msa = require("../domain/Msa");

router.get('/ziptocbsa/upload', (req, res) => {
  let counter = 0;
  let rawDocs = [];

  let csvUrl = req.query.url;

  //https://s3.amazonaws.com/peerstreet-static/engineering/zip_to_msa/zip_to_cbsa.csv
  request(csvUrl).pipe(csv({ raw: false}))
  .on('data', (data) => {
    data = JSON.parse(JSON.stringify(data).replace(/[\u200B-\u200D\uFEFF]/g, ''));
    counter++;
    rawDocs.push({cbsa: data.CBSA, zip: data.ZIP, resRatio: data.RES_RATIO, busRatio: data.BUS_RATIO, othRatio:data.OTH_RATIO, totRatio: data.OTH_RATIO});
  })
  .on('end', function () {
    Cbsa.insertMany(rawDocs)
    .then((mongooseDocuments) => {
         console.log("done");
    })
    .catch(function(err) {
        console.log(err);
    });
    res.status(200).send(`Inserted ${counter} rows`);
  })
});

router.get('/cbsatomsa/upload', (req, res) => {
  let counter = 0;
  let rawDocs = [];

  let csvUrl = req.query.url;

  //https://s3.amazonaws.com/peerstreet-static/engineering/zip_to_msa/cbsa_to_msa.csv
  request(csvUrl).pipe(csv({ raw: false}))
  .on('data', (data) => {
    data = JSON.parse(JSON.stringify(data).replace(/[\u200B-\u200D\uFEFF]/g, ''));
   
    counter++;

    rawDocs.push({
      name: data.NAME,
      cbsa: data.CBSA,
      mdiv: data.MDIV,
      stcou: data.STCOU,
      lsad: data.LSAD,
      census2010pop: data.CENSUS2010POP,
      estimatebase2010: data.ESTIMATESBASE2010,
      popestimate2010: data.POPESTIMATE2010,
      popestimate2011: data.POPESTIMATE2011,
      popestimate2012: data.POPESTIMATE2012,
      popestimate2013: data.POPESTIMATE2013,
      popestimate2014: data.POPESTIMATE2014,
      popestimate2015: data.POPESTIMATE2015,
      npopchg2010: data.NPOPCHG2010,
      npopchg2011: data.NPOPCHG2011,
      npopchg2012: data.NPOPCHG2012,
      npopchg2013: data.NPOPCHG2013,
      npopchg2014: data.NPOPCHG2014,
      npopchg2015: data.NPOPCHG2015,
      births2010: data.BIRTHS2010,
      births2011: data.BIRTHS2011,
      births2012: data.BIRTHS2012,
      births2013: data.BIRTHS2013,
      births2014: data.BIRTHS2014,
      births2015: data.BIRTHS2015,
      deaths2010: data.DEATHS2010,
      deaths2011: data.DEATHS2011,
      deaths2012: data.DEATHS2012,
      deaths2013: data.DEATHS2013,
      deaths2014: data.DEATHS2014,
      deaths2015: data.DEATHS2015,
      naturalinc2010: data.NATURALINC2010,
      naturalinc2011: data.NATURALINC2011,
      naturalinc2012: data.NATURALINC2012,
      naturalinc2013: data.NATURALINC2013,
      naturalinc2014: data.NATURALINC2014,
      naturalinc2015: data.NATURALINC2015,
      internationalmig2010: data.INTERNATIONALMIG2010,
      internationalmig2011: data.INTERNATIONALMIG2011,
      internationalmig2012: data.INTERNATIONALMIG2012,
      internationalmig2013: data.INTERNATIONALMIG2013,
      internationalmig2014: data.INTERNATIONALMIG2014,
      internationalmig2015: data.INTERNATIONALMIG2015,
      domesticmig2010: data.DOMESTICMIG2010,
      domesticmig2011: data.DOMESTICMIG2011,
      domesticmig2012: data.DOMESTICMIG2012,
      domesticmig2013: data.DOMESTICMIG2013,
      domesticmig2014: data.DOMESTICMIG2014,
      domesticmig2015: data.DOMESTICMIG2015,
      netmig2010: data.NETMIG2010,
      netmig2011: data.NETMIG2011,
      netmig2012: data.NETMIG2012,
      netmig2013: data.NETMIG2013,
      netmig2014: data.NETMIG2014,
      netmig2015: data.NETMIG2015,
      residual2010: data.RESIDUAL2010,
      residual2011: data.RESIDUAL2011,
      residual2012: data.RESIDUAL2012,
      residual2013: data.RESIDUAL2013,
      residual2015: data.RESIDUAL2014,
      residual2015: data.RESIDUAL2015
    });
  })
  .on('end', () => {
    Msa.insertMany(rawDocs)
    .then((mongooseDocuments) => {
      console.log(`Inserted ${counter} rows`);
    })
    .catch((err) => {
      console.log(err);
    });
    res.status(200).send(`Inserted ${counter} rows`);
  })
});

module.exports = router;