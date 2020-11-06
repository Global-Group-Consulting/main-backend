export interface ResponseDescriptiveMethods {
  continue(message?: any)
  switchingProtocols(message?: any)
  ok(message?: any)
  created(message?: any)
  accepted(message?: any)
  nonAuthoritativeInformation(message?: any)
  noContent(message?: any)
  resetContent(message?: any)
  partialContent(message?: any)
  multipleChoices(message?: any)
  movedPermanently(message?: any)
  found(message?: any)
  seeOther(message?: any)
  notModified(message?: any)
  useProxy(message?: any)
  temporaryRedirect(message?: any)
  badRequest(message?: any)
  unauthorized(message?: any)
  paymentRequired(message?: any)
  forbidden(message?: any)
  notFound(message?: any)
  methodNotAllowed(message?: any)
  notAcceptable(message?: any)
  proxyAuthenticationRequired(message?: any)
  requestTimeout(message?: any)
  conflict(message?: any)
  gone(message?: any)
  lengthRequired(message?: any)
  preconditionFailed(message?: any)
  requestEntityTooLarge(message?: any)
  requestUriTooLong(message?: any)
  unsupportedMediaType(message?: any)
  requestedRangeNotSatisfiable(message?: any)
  expectationFailed(message?: any)
  unprocessableEntity(message?: any)
  tooManyRequests(message?: any)
  internalServerError(message?: any)
  notImplemented(message?: any)
  badGateway(message?: any)
  serviceUnavailable(message?: any)
  gatewayTimeout(message?: any)
  httpVersionNotSupported(message?: any)
}

export interface AdonisHttpResponse extends ResponseDescriptiveMethods {

}
