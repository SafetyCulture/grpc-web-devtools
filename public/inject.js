(() => {
  window.__GRPCWEB_DEVTOOLS__ = function (clients) {
    if (clients.constructor !== Array) {
      return;
    }
    const postType = "__GRPCWEB_DEVTOOLS__";
    var StreamInterceptor = function (method, request, stream) {
      this._callbacks = {};
      const methodType = "server_streaming";
      window.postMessage({
        type: postType,
        method,
        methodType,
        request: request.toObject(),
      });
      stream.on("data", (response) => {
        window.postMessage({
          type: postType,
          method,
          methodType,
          response: response.toObject(),
        });
        if (!!this._callbacks["data"]) {
          this._callbacks["data"](response);
        }
      });
      stream.on("metadata", (status) => {
        window.postMessage({
          type: postType,
          method,
          methodType,
          response: status,
        });
        if (!!this._callbacks["metadata"]) {
          this._callbacks["metadata"](status);
        }
      });
      stream.on("status", (status) => {
        if (status.code === 0) {
          window.postMessage({
            type: postType,
            method,
            methodType,
            response: "EOF",
          });
        }
        if (!!this._callbacks["status"]) {
          this._callbacks["status"](status);
        }
      });
      stream.on("error", (error) => {
        if (error.code !== 0) {
          window.postMessage({
            type: postType,
            method,
            methodType,
            error: {
              code: error.code,
              message: error.message,
            },
          });
        }
        if (!!this._callbacks["error"]) {
          this._callbacks["error"](error);
        }
      });
      stream.on("end", () => {
        window.postMessage({
          type: postType,
          method,
          methodType,
        });
        if (!!this._callbacks["end"]) {
          this._callbacks["end"]();
        }
      });
      this._stream = stream;
    };
    StreamInterceptor.prototype.on = function (type, callback) {
      this._callbacks[type] = callback;
      return this;
    };
    StreamInterceptor.prototype.removeListener = function (type, callback) {
      delete this._callbacks[type];
      return this;
    };
    StreamInterceptor.prototype.cancel = function () {
      this._stream.cancel();
    };
    clients.map((client) => {
      client.client_.rpcCall_ = client.client_.rpcCall;
      client.client_.rpcCall2 = function (
        method,
        request,
        metadata,
        methodInfo,
        callback
      ) {
        var posted = false;
        var newCallback = function (err, response) {
          if (!posted) {
            window.postMessage(
              {
                type: postType,
                method,
                methodType: "unary",
                request: request.toObject(),
                response: err ? undefined : response.toObject(),
                error: err || undefined,
              },
              "*"
            );
            posted = true;
          }
          callback(err, response);
        };
        return this.rpcCall_(
          method,
          request,
          metadata,
          methodInfo,
          newCallback
        );
      };
      client.client_.rpcCall = client.client_.rpcCall2;
      client.client_.unaryCall = function (
        method,
        request,
        metadata,
        methodInfo
      ) {
        return new Promise((resolve, reject) => {
          this.rpcCall2(
            method,
            request,
            metadata,
            methodInfo,
            function (error, response) {
              error ? reject(error) : resolve(response);
            }
          );
        });
      };
      client.client_.serverStreaming_ = client.client_.serverStreaming;
      client.client_.serverStreaming2 = function (
        method,
        request,
        metadata,
        methodInfo
      ) {
        var stream = client.client_.serverStreaming_(
          method,
          request,
          metadata,
          methodInfo
        );
        var si = new StreamInterceptor(method, request, stream);
        return si;
      };
      client.client_.serverStreaming = client.client_.serverStreaming2;
    });
  };
})();
