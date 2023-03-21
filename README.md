# Debug-auth-headers dev tool
This is a tool to proxy sparql queries and headers from inside the mu.semtech network
This uses (https://github.com/mu-semtech/mu-javascript-template) as a base image.  A corresponding frontend can be found at https://github.com/redpencilio/frontend-debug-auth-headers

# Setup
The front-end part of this tool expects the back-end to be located at /debug-auth-headers
So add this to your files 

`docker-compose.yml`:
```
  #debug-headers
  debug-auth-headers:
    image: redpencil/debug-auth-headers
    links:
      - database:database
```
`config/dispatcher/dispatcher.ex`:
```
  #debug-headers
  match "/debug-auth-headers/*path" do
    Proxy.forward conn, path, "http://debug-auth-headers/"
  end
```
# Usage
There are 2 endpoints

## GET /get-headers:

returns the headers received by the service in a JSON format

## POST /send-request:

sends headers and query provided in the JSON body of the request and then returns the servers response in a similar structure

### sample request:
```
{
  "query": "SELECT (COUNT (?a) as ?count)\nWHERE{\n  ?a ?b ?c.\n}",
  "headers": {
    "mu-auth-allowed-groups": "[{\"variables\":[],\"name\":\"public\"}]"
  }
}
```
### expected response:
```
{
  "body": {
    "results": {
      "ordered": true,
      "distinct": false,
      "bindings": [
        {
          "count": {
            "value": "3043640",
            "type": "typed-literal",
            "datatype": "http://www.w3.org/2001/XMLSchema#integer"
          }
        }
      ]
    },
    "head": {
      "vars": [
        "count"
      ],
      "link": []
    }
  },
  "headers": {
    "cache-control": "max-age=0, private, must-revalidate",
    "connection": "close",
    "content-length": "201",
    "content-type": "application/sparql-results+json; charset=utf-8",
    "date": "Tue, 21 Jan 2020 16:15:14 GMT",
    "mu-auth-allowed-groups": "[{\"variables\":[],\"name\":\"public\"}]",
    "mu-auth-used-groups": "[{\"variables\":[],\"name\":\"public\"}]",
    "server": "Cowboy"
  }
}
```
