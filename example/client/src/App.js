import * as React from "react";
import './App.css';
import {ExampleServiceClient, ExampleServicePromiseClient} from './example_grpc_web_pb';
import {ExampleOneRequest, ExampleTwoRequest, StreamRequest} from './example_pb';
import Sentencer from 'sentencer';

const devInterceptors = window.__GRPCWEB_DEVTOOLS__ || (() => {
});
const {
  devToolsUnaryInterceptor,
  devToolsStreamInterceptor,
} = devInterceptors();

const promiseOpts = {
  unaryInterceptors: [devToolsUnaryInterceptor],
  streamInterceptors: [devToolsStreamInterceptor],
};

const promiseClient = new ExampleServicePromiseClient(
  'http://0.0.0.0:18080', null, promiseOpts);

const callbackOpts = {
  unaryInterceptors: [devToolsUnaryInterceptor],
  streamInterceptors: [devToolsStreamInterceptor],
};

const callbackClient = new ExampleServiceClient(
  'http://0.0.0.0:18080', null, callbackOpts);

function App() {

  const [message, setMessage] = React.useState('Starting gRPC tests...');

  function exampleOne() {
    const req = new ExampleOneRequest();
    req.setMsg(Sentencer.make("This is {{ an_adjective }} {{ noun }}."));
    promiseClient.exampleOne(req).then(res => {
      setMessage(res.getMsg());
    }).catch(console.error)
  }

  function exampleTwo() {
    const req = new ExampleTwoRequest();
    let count = 1;
    callbackClient.exampleTwo(req, null, (err, res) => {
      if (err) {
        return console.error(err);
      }
      setMessage(`${res.getMsg()} (${count++})`);
    })
  }

  function alwaysError() {
    promiseClient.alwaysError(new ExampleOneRequest()).catch(() => {
    })
  }

  function formatDateTime(timestamp) {
    timestamp = timestamp.substring(0, timestamp.lastIndexOf('m') - 1);
    const dt = new Date(timestamp);
    return dt.toISOString();
  }
  function exampleStream(isErr) {
    var req = new StreamRequest();
    req.setError(isErr);
    const stream = promiseClient.streamingExample(req);
    stream.on('data', res => {
      setMessage(formatDateTime(res.getTime()));
    });
    stream.on('status', console.log);
    stream.on('error', console.log);
  }

  function exampleStreamChain() {
    promiseClient.streamingExample(new StreamRequest())
      .on('data', res => {
        setMessage(formatDateTime(res.getTime()));
      })
      .on('status', console.warn)
      .on('error', console.error);
  }

  React.useEffect(() => {
    exampleOne()
    exampleStreamChain()
    exampleStream(true)
    setInterval(exampleOne, 8000)
    setInterval(exampleTwo, 10000)
    setInterval(alwaysError, 15000)
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <p>
          {message}
        </p>
      </header>
    </div>
  );
}

export default App;
