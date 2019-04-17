// Copyright (c) 2019 SafetyCulture Pty Ltd. All Rights Reserved.

import Sentencer from 'sentencer';
import { ExampleTwoRequest } from './example2_pb';
import { ExampleServicePromiseClient } from './example_grpc_web_pb';
import { ExampleOneRequest } from './example_pb';

const __DEV__ = true;
const enableDevTools = window.__GRPCWEB_DEVTOOLS__ || (() => { });

const body = document.getElementsByTagName('body')
const client = new ExampleServicePromiseClient('http://0.0.0.0:18080', null, null);

if (__DEV__) {
  enableDevTools([
    client,
  ])
}

function exampleOne() {
  const req1 = new ExampleOneRequest();
  req1.setMsg(Sentencer.make("This is {{ an_adjective }} {{ noun }}."));
  client.exampleOne(req1).then(res => {
    document.body.innerHTML += `<div>${res.getMsg()}</div>`
  }).catch(console.error)
}

function exampleTwo() {
  const req1 = new ExampleTwoRequest();
  client.exampleTwo(req1).then(res => {
    document.body.innerHTML += `<div>${res.getMsg()}</div>`
  }).catch(console.error)
}

function alwaysError() {
  client.alwaysError(new ExampleOneRequest()).catch(()=>{})
}

exampleOne()
setInterval(exampleOne, 8000)
setInterval(exampleTwo, 10000)
setInterval(alwaysError, 15000)