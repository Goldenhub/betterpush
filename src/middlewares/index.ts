import { authenticate, authenticateResetPassword } from "./authentication.middleware";
import { errorHandler } from "./errorHandler.middleware";
import { unknownEndpoints } from "./unknownEndpoint.middleware";
import { validate } from "./validators.middleware";
// import { wrappedUploadFunction, pdfUpload } from './upload.middleware';

export { errorHandler, unknownEndpoints, authenticate, authenticateResetPassword, validate };
