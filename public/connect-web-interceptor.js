const MethodKind = {
  Unary: 0,
  ServerStreaming: 1,
};

// This interceptor will be passed every request and response. We will take that request and response
// and post a message to the window. This will allow us to access this message in the content script. This
// is all to make the manifest v3 happy.
const interceptor = (next) => async (req) => {
  switch (req.method.kind) {
    case MethodKind.Unary:
      try {
        assert(!req.stream);
        const resp = await next(req);
        assert(!resp.stream);
        post(req.service, req.method, req.message, resp.message);
        return resp;
      } catch (e) {
        post(req.service, req.method, req.message, undefined, e);
        throw e;
      }
    case MethodKind.ServerStreaming:
      try {
        assert(req.stream);
        let reqMessage;
        const resp = await next({
          ...req,
          message: wrap(
            req.message, message => {
              reqMessage = message;
            },
            reason => {
              post(req.service, req.method, reqMessage, undefined, reason);
            })
        });
        assert(resp.stream);
        return {
          ...resp,
          message: wrap(
            resp.message,
            message => {
              post(req.service, req.method, reqMessage, message);
            }, reason => {
              post(req.service, req.method, reqMessage, undefined, reason);
            })
        };
      } catch (e) {
        post(req.service, req.method, undefined, undefined, e);
        throw e;
      }
    default:
      assert(false);
  }
};

function post(service, method, requestMessage, responseMessage, error = undefined) {
  const m = {
    type: "__GRPCWEB_DEVTOOLS__",
    methodType: method.kind === MethodKind.Unary ? "unary" : "server_streaming",
    method: service.typeName + "/" + method.name,
    request: undefined,
    response: undefined,
  };
  if (requestMessage) {
    try {
      m.request = requestMessage.toJson({emitDefaultValues: true});
    } catch (e) {
      // serializing google.protobuf.Any requires a type registry
    }
  }
  if (responseMessage) {
    try {
      m.response = responseMessage.toJson({emitDefaultValues: true});
    } catch (e) {
      // serializing google.protobuf.Any requires a type registry
    }
  }
  if (error) {
    m.error = {
      message: error.message,
      code: error.code,
    };
  }
  window.postMessage(m, "*");
}

function wrap(it, onMessage, onError) {
  async function* generator() {
    try {
      for await (const m of it) {
        onMessage(m);
        yield m;
      }
    } catch (e) {
      onError(e);
      throw e;
    }
  }

  return generator();
}

function assert(condition) {
  if (!condition) {
    throw new Error("assertion failed");
  }
}

window.__CONNECT_WEB_DEVTOOLS__ = interceptor;

// Since we are loading inject.js as a script, the order at which it is loaded is not guaranteed.
// So we will publish a custom event that can be used, to be used to assign the interceptor.
const readyEvent = new CustomEvent("connect-web-dev-tools-ready");
window.dispatchEvent(readyEvent);
