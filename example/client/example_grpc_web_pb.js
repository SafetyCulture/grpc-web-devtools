/**
 * @fileoverview gRPC-Web generated client stub for s12.example
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!



const grpc = {};
grpc.web = require('grpc-web');


var example2_pb = require('./example2_pb.js')
const proto = {};
proto.s12 = {};
proto.s12.example = require('./example_pb.js');

/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.s12.example.ExampleServiceClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

  /**
   * @private @const {?Object} The credentials to be used to connect
   *    to the server
   */
  this.credentials_ = credentials;

  /**
   * @private @const {?Object} Options for the client
   */
  this.options_ = options;
};


/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.s12.example.ExampleServicePromiseClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

  /**
   * @private @const {?Object} The credentials to be used to connect
   *    to the server
   */
  this.credentials_ = credentials;

  /**
   * @private @const {?Object} Options for the client
   */
  this.options_ = options;
};


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.s12.example.ExampleOneRequest,
 *   !proto.s12.example.ExampleOneResponse>}
 */
const methodInfo_ExampleService_ExampleOne = new grpc.web.AbstractClientBase.MethodInfo(
  proto.s12.example.ExampleOneResponse,
  /** @param {!proto.s12.example.ExampleOneRequest} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.s12.example.ExampleOneResponse.deserializeBinary
);


/**
 * @param {!proto.s12.example.ExampleOneRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.s12.example.ExampleOneResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.s12.example.ExampleOneResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.s12.example.ExampleServiceClient.prototype.exampleOne =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/s12.example.ExampleService/ExampleOne',
      request,
      metadata || {},
      methodInfo_ExampleService_ExampleOne,
      callback);
};


/**
 * @param {!proto.s12.example.ExampleOneRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.s12.example.ExampleOneResponse>}
 *     A native promise that resolves to the response
 */
proto.s12.example.ExampleServicePromiseClient.prototype.exampleOne =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/s12.example.ExampleService/ExampleOne',
      request,
      metadata || {},
      methodInfo_ExampleService_ExampleOne);
};


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.s12.example.ExampleTwoRequest,
 *   !proto.s12.example.ExampleTwoResponse>}
 */
const methodInfo_ExampleService_ExampleTwo = new grpc.web.AbstractClientBase.MethodInfo(
  example2_pb.ExampleTwoResponse,
  /** @param {!proto.s12.example.ExampleTwoRequest} request */
  function(request) {
    return request.serializeBinary();
  },
  example2_pb.ExampleTwoResponse.deserializeBinary
);


/**
 * @param {!proto.s12.example.ExampleTwoRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.s12.example.ExampleTwoResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.s12.example.ExampleTwoResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.s12.example.ExampleServiceClient.prototype.exampleTwo =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/s12.example.ExampleService/ExampleTwo',
      request,
      metadata || {},
      methodInfo_ExampleService_ExampleTwo,
      callback);
};


/**
 * @param {!proto.s12.example.ExampleTwoRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.s12.example.ExampleTwoResponse>}
 *     A native promise that resolves to the response
 */
proto.s12.example.ExampleServicePromiseClient.prototype.exampleTwo =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/s12.example.ExampleService/ExampleTwo',
      request,
      metadata || {},
      methodInfo_ExampleService_ExampleTwo);
};


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.s12.example.ExampleOneRequest,
 *   !proto.s12.example.ExampleOneResponse>}
 */
const methodInfo_ExampleService_AlwaysError = new grpc.web.AbstractClientBase.MethodInfo(
  proto.s12.example.ExampleOneResponse,
  /** @param {!proto.s12.example.ExampleOneRequest} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.s12.example.ExampleOneResponse.deserializeBinary
);


/**
 * @param {!proto.s12.example.ExampleOneRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.s12.example.ExampleOneResponse)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.s12.example.ExampleOneResponse>|undefined}
 *     The XHR Node Readable Stream
 */
proto.s12.example.ExampleServiceClient.prototype.alwaysError =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/s12.example.ExampleService/AlwaysError',
      request,
      metadata || {},
      methodInfo_ExampleService_AlwaysError,
      callback);
};


/**
 * @param {!proto.s12.example.ExampleOneRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.s12.example.ExampleOneResponse>}
 *     A native promise that resolves to the response
 */
proto.s12.example.ExampleServicePromiseClient.prototype.alwaysError =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/s12.example.ExampleService/AlwaysError',
      request,
      metadata || {},
      methodInfo_ExampleService_AlwaysError);
};


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.s12.example.StreamRequest,
 *   !proto.s12.example.ServerTime>}
 */
const methodInfo_ExampleService_StreamingExample = new grpc.web.AbstractClientBase.MethodInfo(
  proto.s12.example.ServerTime,
  /** @param {!proto.s12.example.StreamRequest} request */
  function(request) {
    return request.serializeBinary();
  },
  proto.s12.example.ServerTime.deserializeBinary
);


/**
 * @param {!proto.s12.example.StreamRequest} request The request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.s12.example.ServerTime>}
 *     The XHR Node Readable Stream
 */
proto.s12.example.ExampleServiceClient.prototype.streamingExample =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/s12.example.ExampleService/StreamingExample',
      request,
      metadata || {},
      methodInfo_ExampleService_StreamingExample);
};


/**
 * @param {!proto.s12.example.StreamRequest} request The request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!grpc.web.ClientReadableStream<!proto.s12.example.ServerTime>}
 *     The XHR Node Readable Stream
 */
proto.s12.example.ExampleServicePromiseClient.prototype.streamingExample =
    function(request, metadata) {
  return this.client_.serverStreaming(this.hostname_ +
      '/s12.example.ExampleService/StreamingExample',
      request,
      metadata || {},
      methodInfo_ExampleService_StreamingExample);
};


module.exports = proto.s12.example;

