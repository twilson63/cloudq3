# Cloudq v3

A lightweight message queue, using restify and redis.

## API

* Post a Message

### POST http://example.com/:queue

request body
``` json
{ "job": { 
  "klass": "FooClass", 
  "args": ["Bar","Baz"]
  }
}
```

* Get a Message

### GET http://example.com/:queue

response body
``` json
{ "id": 1,
  "job": { 
  "klass": "FooClass", 
  "args": ["Bar","Baz"]
  }
}
```

* Complete/Remove a Message

### DELETE http://example.com/:id

response statusCode 200

## Requirements

* Redis (http://redis.io)
* NodeJs (http://nodejs.org)

## Install

``` sh
npm install cloudq -g
```

## Run Quiet Mode

``` sh
cloudq --config ./config.js
```

## Create Config File

``` sh
cloudq init
```

## Run Debug Mode

``` sh
cloudq --debug --config ./config.json
```

## Config File Spec

``` js
{
  namespace: 'cloudq',
  expire: (60 * 60) * 72,
  redis: {
    host: 'localhost',
    port: 6379,
  }
}
```

## LICENSE

MIT

## ROADMAP

## THANKS

