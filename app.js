import { app, errorHandler, query, express } from 'mu';
import httpContext from 'express-http-context';

const fetch = require('node-fetch');
const bodyParser=require('body-parser');

app.use(bodyParser.json());
app.use(errorHandler);

function uriSerialize(object) {
  var uriAttr = [];
  for (var p in object)
    if (object.hasOwnProperty(p)) {
      uriAttr.push(encodeURIComponent(p) + "=" + encodeURIComponent(object[p]));
    }
  return uriAttr.join("&");
}

async function bypassQuery(myQuery, myHeaders, responseType){

  var endPoint=process.env.MU_SPARQL_ENDPOINT;
  
  var data={
    'should-sponge': '',
    'query': myQuery,
    'format': responseType,
    'defaultGraphUri': '',
    'timeout': 0,
    'debug': 'on',
    'run':  'Run Query'
  }

  data=uriSerialize(data);
  
  myHeaders['Content-Type']='application/x-www-form-urlencoded'
  
  const response = await fetch(endPoint, {
    method: 'POST',
    headers: myHeaders,
    body: data
  });

  var headers=response.headers.raw();
  
  //normalizing fetch headers
  for(var p in headers){
    headers[p]=headers[p].toString();
  }
  
  if (response.ok && headers["content-type"]=="application/sparql-results+json; charset=utf-8"){
    var body=await response.json();
  }
  else{
    var body=await response.text();
  }
  
  return {body: body, headers: headers};  
  
}

app.get('/get-headers', function(req, res){
  //debugger;
  res.send(req.headers);
});

app.post('/send-request', function(req, res){
  var responseTypes=[
    'application/sparql-results+json',
    'text/html',
    'text/x-html+tr',
    'application/sparql-results+xml',
    'application/vnd.ms-excel',
    'application/javascript',
    'text/turtle',
    'application/rdf+xml',
    'text/plain',
    'text/csv',
    'text/tab-separated-values'
  ];

  var myHeaders=req.body.headers;
  var myQuery=req.body.query;
  //debugger;
  // var myHeaders={
  //   'Content-Type': 'application/x-www-form-urlencoded',
  //   'mu-auth-allowed-groups': '[{"variables":[],"name":"public"}]'
  // };

  // var myQuery = `
  //   SELECT *
  //     WHERE{
  //       ?a ?b ?c.
  //   }LIMIT 100`;
  
  bypassQuery(myQuery, myHeaders, responseTypes[0]).then(function(response){
    //debugger;
    res.send(response);
  });
});



