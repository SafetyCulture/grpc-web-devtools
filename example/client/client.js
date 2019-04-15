// Copyright (c) 2019 SafetyCulture Pty Ltd. All Rights Reserved.

import Sentencer from 'sentencer';
import { ExampleServicePromiseClient } from './example_grpc_web_pb';
import { ExampleOneRequest } from './example_pb';
import { ExampleTwoRequest } from './example2_pb';

const __DEV__ = true;

// TODO: This should be in a npm package
const enableDevTools = function (clients) {
  if (clients.constructor !== Array) {
    return
  }

  clients.map(clients => {
    client.client_.rpcCall2 = function (method, request, metadata, methodInfo, callback) {
      var newCallback = function (err, response) {
        window.postMessage({
          type: "__GRPCWEB_DEVTOOLS__",
          method,
          request: request.toObject(),
          response: err ? null : response.toObject(),
          error: err,
        }, "*")
        callback(err, response)
      }
      return this.rpcCall(method, request, metadata, methodInfo, newCallback);
    }
    client.client_.unaryCall = function (method, request, metadata, methodInfo) {
      return new Promise((resolve, reject) => {
        this.rpcCall2(method, request, metadata, methodInfo, function (error, response) {
          error ? reject(error) : resolve(response);
        });
      });
    };
  })
}



var body = document.getElementsByTagName('body')
var client = new ExampleServicePromiseClient('http://0.0.0.0:18080', null, null);

// console.log(client)

if (__DEV__) {
  enableDevTools([
    client,
  ])
}

function exampleOne() {
  var req1 = new ExampleOneRequest();
  req1.setMsg(Sentencer.make("This is {{ an_adjective }} {{ noun }}."));
  client.exampleOne(req1).then(res => {
    document.body.innerHTML += `<div>${res.getMsg()}</div>`
    // console.log(res.toObject())
  }).catch(console.error)
}

function exampleTwo() {
  var req1 = new ExampleTwoRequest();
  client.exampleTwo(req1).then(res => {
    document.body.innerHTML += `<div>${res.getMsg()}</div>`
    // console.log(res.toObject())
  }).catch(console.error)
}

exampleOne()
setInterval(exampleOne, 8000)
setInterval(exampleTwo, 10000)