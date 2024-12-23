const POST_TYPE = "__GRPCWEB_DEVTOOLS__";
const METHOD_TYPE_SERVER_STREAMING = "server_streaming";
const METHOD_TYPE_UNARY = "unary";

function postWindowMessage({ type, method, methodType, request, response, error }) {
  window.postMessage({
    type,
    method,
    methodType,
    request: request?.toObject(),
    response: response?.toObject(),
    error: error ? { code: error.code, message: error.message } : undefined,
  }, "*");
}

function StreamInterceptor(method, request, stream) {
  this._callbacks = {};
  this._stream = stream;

  postWindowMessage({
    type: POST_TYPE,
    method,
    methodType: METHOD_TYPE_SERVER_STREAMING,
    request
  });

  stream.on('data', (response) => {
    postWindowMessage({
      type: POST_TYPE,
      method,
      methodType: METHOD_TYPE_SERVER_STREAMING,
      response
    });

    if (this._callbacks['data']) {
      this._callbacks['data'](response);
    }
  });

  stream.on('status', (status) => {
    if (status.code === 0) {
      postWindowMessage({
        type: POST_TYPE,
        method,
        methodType: METHOD_TYPE_SERVER_STREAMING,
        response: "EOF"
      });
    }
    if (this._callbacks['status']) {
      this._callbacks['status'](status);
    }
  });

  stream.on('error', (error) => {
    if (error.code !== 0) {
      postWindowMessage({
        type: POST_TYPE,
        method,
        methodType: METHOD_TYPE_SERVER_STREAMING,
        error
      });
    }
    if (this._callbacks['error']) {
      this._callbacks['error'](error);
    }
  });
}

StreamInterceptor.prototype.on = function (type, callback) {
  this._callbacks[type] = callback;
  return this;
};

StreamInterceptor.prototype.cancel = function () {
  this._stream.cancel();
};

window.__GRPCWEB_DEVTOOLS__ = function (clients) {
  if (!Array.isArray(clients)) return;

  clients.forEach((client) => {
    const originalRpcCall = client.client_.rpcCall;
    client.client_.rpcCall = function (method, request, metadata, methodInfo, callback) {
      let posted = false;
      const wrappedCallback = (err, response) => {
        if (!posted) {
          postWindowMessage({
            type: POST_TYPE,
            method,
            methodType: METHOD_TYPE_UNARY,
            request,
            response: err ? undefined : response,
            error: err || undefined,
          });
          posted = true;
        }
        callback(err, response);
      };
      return originalRpcCall.call(this, method, request, metadata, methodInfo, wrappedCallback);
    };

    client.client_.unaryCall = function (method, request, metadata, methodInfo) {
      return new Promise((resolve, reject) => {
        this.rpcCall(method, request, metadata, methodInfo, (error, response) =>
          error ? reject(error) : resolve(response)
        );
      });
    };

    const originalServerStreaming = client.client_.serverStreaming;
    client.client_.serverStreaming = function (method, request, metadata, methodInfo) {
      const stream = originalServerStreaming.call(this, method, request, metadata, methodInfo);
      return new StreamInterceptor(method, request, stream);
    };
  });
};
