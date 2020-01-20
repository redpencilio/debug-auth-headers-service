# Debug-auth-headers dev tool
This is a tool to proxy sparql queries and headers from inside the mu.semtech network
This uses (https://github.com/mu-semtech/mu-javascript-template) as a base image

# Setup
The front-end part of this tool expects the back-end to be located at /debug-auth-headers
So add this to your files 

docker-compose.yml:
```
  #debug-headers
  debug-auth-headers:
    image: redpencil/debug-auth-headers
    ports:
      - 9229:9229
    environment:
      NODE_ENV: "development"
    links:
      - database:database
```
config/dispatcher/dispatcher.ex:
```
  #debug-headers
  match "/debug-auth-headers/*path" do
    Proxy.forward conn, path, "http://debug-auth-headers/"
  end
```
# Usage
There are 2 endpoints

GET /get-headers:

returns the headers recived by the service in a JSON format

POST /send-request:

sends headers and query provided in the JSON body of the request and then returns the servers response in the same structure

