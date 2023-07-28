import { randomUUID } from "crypto";

export default function requestEntry(req, res, next) {
  let requestId = req.headers.request_id;

  if (!requestId) {
    requestId = randomUUID();

    req.headers.request_id = requestId;

    req.meta = {
      request_id: req.headers.request_id,
      method: req.method,
    };
  }

  next();
}
