# Cloudq3

Cloudq is a very simple message queue that has a http/json
api.  It contains three basic functions:

- Put a message on a queue
- Get the first pending message from the queue - FIFO
- Remove the message when done

The main use case for this application is to offload work
from your main request, but have 1 - n workers handling the
work.  For example, if the user of your web application has
requested for an intensive process to be run, but the application
does not need the user to wait around for the process to be performed.  Then you can submit the instructions to cloudq and
have an army of workers waiting around to do the work then notify
your application when the work is complete and the application can notify the user.

## FAQ

* How do I create queues?  

Once you do a post to /myqueue, cloudq automatically creates the queue if it does not exist.

* What does the expire config setting do?

If for some reason your worker fails to remove the message, the expire function instructs redis to remove it regardless of status.  This will keep the datastore small and light.

* How does this compare to other messages queues like amqp, sqs, etc?

Cloudq is meant to be simple and responsive, amqp is great, if you need all of the features, sqs is great as well, but we found it to be a little slow for our needs, also we needed to control the storage location of the data.  The bottom line is that cloudq is not much different than the other solutions, it just tries to be very simple to use, install, deploy.

* How many messages per sec can cloudq handle?

Check out the examples folder, there are a couple of benchmark tests in there.  Cloudq is not trying to be the fastest kid on the block, but it is not slow either.  On a Mac Air I was able to get approx 333 posts/sec and 500 gets/sec.  Also we are processing over 100K messages per day and using as little as 200 MB Ram 10% CPU for Cloudq and Redis combined.  These numbers work for our needs, if you need 1000+ x/sec, you may want to look at some other solutions.


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
npm install cloudq3 -g
```

## Run Quiet Mode

``` sh
cloudq3 --config ./config.js
```

## Create Config File

``` sh
cloudq3 init
```

## Run Debug Mode

``` sh
cloudq3 --debug --config ./config.json

## Run Legacy Mode

Legacy mode will support the same api and functionality of node-cloudq

``` sh
cloudq3 --legacy --config ./config.json
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

## Design Goals

* API should be simple
* Any JSON message should be allowed
* Jobs will expire based on expire config setting
* Prioritization will always be first in first out for every queue
* queue names cannot have spaces
* stats page should be simple

## ROADMAP

* Add (Notification)Email Support
* Add Integration with Dingbot for checkin

## THANKS

* Mark Gunnels (http://github.com/markgunnels)
* Kevin Stewart (http://github.com/kdstew)
* Barrett Little (http://github.com/pblittle)
* Andrew Kennedy (http://github.com/akennedy)
