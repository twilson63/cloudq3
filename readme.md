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

* Redis
* NodeJs

## Install

``` sh
npm install cloudq -g
```

## Run Verbose Mode

``` sh
cloudq --verbose --config ./config.js
```

## Run Quiet Mode

``` sh
cloudq --config ./config.js
```

## Create Config File

``` sh
cloudq init
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

