// Copyright (c) 2019 SafetyCulture Pty Ltd. All Rights Reserved.

import Sentencer from 'sentencer';
import { ExampleTwoRequest } from './example2_pb';
import { ExampleServiceClient, ExampleServicePromiseClient } from './example_grpc_web_pb';
import { ExampleOneRequest, StreamRequest } from './example_pb';

const __DEV__ = true;
const enableDevTools = window.__GRPCWEB_DEVTOOLS__ || (() => { });

const body = document.getElementsByTagName('body')
const client = new ExampleServicePromiseClient('http://0.0.0.0:18080');
const client2 = new ExampleServiceClient('http://0.0.0.0:18080');

if (__DEV__) {
  enableDevTools([
    client,
    client2,
  ])
}

function exampleOne() {
  const req = new ExampleOneRequest();
  req.setMsg(Sentencer.make("This is {{ an_adjective }} {{ noun }}."));
  client.exampleOne(req).then(res => {
    document.body.innerHTML += `<div>${res.getMsg()}</div>`;
  }).catch(console.error)
}

function exampleTwo() {
  const req = new ExampleTwoRequest();
  client2.exampleTwo(req, null, (err, res) => {
    if (err) {
      return console.error(err);
    }
    document.body.innerHTML += `<div>${res.getMsg()}</div>`;
  })
}

function alwaysError() {
  client.alwaysError(new ExampleOneRequest()).catch(() => { })
}

function exampleStream(isErr) {
  var req = new StreamRequest();
  req.setError(isErr);
  const stream = client.streamingExample(req);
  stream.on('data', res => {
    document.body.innerHTML += `<div>${res.getTime()}</div>`;
  });
  stream.on('status', console.log);
  stream.on('error', console.log);
  stream.on('end', () => console.log('end of stream'));
}

function exampleStreamChain() {
  client.streamingExample(new StreamRequest())
    .on('data', res => {
      document.body.innerHTML += `<div>${res.getTime()}</div>`;
    })
    .on('status', console.warn)
    .on('error', console.error)
    .on('end', () => console.log('end of stream'));
}

exampleOne()
exampleStreamChain()
exampleStream(true)
setInterval(exampleOne, 8000)
setInterval(exampleTwo, 10000)
setInterval(alwaysError, 15000)
