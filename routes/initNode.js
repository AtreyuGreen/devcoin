var express = require('express');
var router = express.Router();


const { MasterNode } = require('../elements/masternode');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function redirectIndex(res){
  res.redirect('/');
  res.end();
}

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("recogiendo");
  let masterNode = new MasterNode();
  //Recogemos los parámetros get, si es status=true significa que se desea iniciar. Si es status=false, se quiere detener.
  if(req.query.status !== undefined)
  {
    let status = req.query.status;
    if(status == "true") masterNode.start(function(){redirectIndex(res)});
    else masterNode.stop(function() {redirectIndex(res)});
  }
  else{
    res.writeHead(500, {});
    res.write("Bad request");
    res.end();
  }
});

module.exports = router;
