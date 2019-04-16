/**
 * gRPC-Web Dev Tools service mapping generated for s12.example
 */

// GENERATED CODE -- DO NOT EDIT!



var example2_pb = require('./example2_pb.js')
const proto = {};
proto.s12 = {};
proto.s12.example = require('./example_pb.js');

window.__GRPCWEB_DEVTOOLS__ = window.__GRPCWEB_DEVTOOLS__ || { services: {} };

window.__GRPCWEB_DEVTOOLS__.services['/s12.example.ExampleService/ExampleOne'] = {
  requestDeserializeFn: proto.s12.example.ExampleOneRequest.deserializeBinary,
  responseDeserializeFn: proto.s12.example.ExampleOneResponse.deserializeBinary
};

window.__GRPCWEB_DEVTOOLS__.services['/s12.example.ExampleService/ExampleTwo'] = {
  requestDeserializeFn: example2_pb.ExampleTwoRequest.deserializeBinary,
  responseDeserializeFn: example2_pb.ExampleTwoResponse.deserializeBinary
};

