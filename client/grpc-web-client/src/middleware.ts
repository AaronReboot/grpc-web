import {Metadata} from "./metadata";
import {ProtobufMessage} from "./message";
import {Code} from "./Code";
import {MethodDefinition} from "./service";
import {ClientRpcOptions} from "./client";

const noop = () => undefined;

/*
 * MiddlewareConstructor is used to construct a request specific middleware.
 *
 * MiddlewareConstructor must return a partial or complete implementation of
 * a middleware in order to function correctly. The partial implementation
 * will be merged with a default implementation which has no side effects.
 */
export interface MiddlewareConstructor<
  TRequest extends ProtobufMessage,
  TResponse extends ProtobufMessage,
  M extends MethodDefinition<TRequest, TResponse>,
> {
  (descriptor: M, props: ClientRpcOptions<TRequest, TResponse, M>): Partial<Middleware<TRequest, TResponse>>
}

// Middleware is the canonical definition of a Middleware.
export interface Middleware<
  TRequest extends ProtobufMessage,
  TResponse extends ProtobufMessage,
> {
  // onStart is invoked immediately before a request is initiated.
  // onStart can modify the provided metadata object to attach additional headers.
  onStart(metadata: Metadata): undefined;

  // onSend is invoked immediately before a new message is send to the server
  // from the client.
  // onSend is invoked each time a message is sent to the server.
  onSend(message: TRequest): undefined;

  // onFinishSend is invoked immediately after onFinishSend is invoked on a request.
  // onFinishSend is invoked at most once per request.
  onFinishSend(): undefined;

  // onHeaders is invoked immediately before onHeaders callback is triggered.
  // onHeaders is only invoked once per request.
  onHeaders(headers: Metadata): undefined;

  // onMessage is invoked immediately before onMessage callback is triggered.
  // onMessage is invoked once for each message received from the response.
  onMessage(response: TResponse): undefined;

  // onEnd is invoked immediately after the onEnd callback is triggered.
  // onEnd is invoked once per request.
  onEnd(status: Code, statusMessage: string, trailers: Metadata): undefined;

  // onClose is invoked immediately after onClose is triggered on a request.
  // onClose is invoked at most once per request.
  onClose(): undefined;
}

// IdentityMiddleware is a no-operation default middleware.
// IdentityMiddleware is merged with any provided implementation.
export const IdentityMiddleware: Middleware<any, any> = {
  onStart: noop,
  onSend: noop,
  onFinishSend: noop,
  onClose: noop,
  onMessage: noop,
  onHeaders: noop,
  onEnd: noop,
};