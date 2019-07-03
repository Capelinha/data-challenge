const headers = {
  'Access-Control-Allow-Methods': '*',
  'Access-Control-Allow-Origin': '*',
  'Content-Type': 'application/json'
};

const build = (statusCode) => (body) => {
  const response = {
    headers,
    statusCode,
    body: body !== undefined ? JSON.stringify(body) : ''
  };
  
  return response;
};

const buildError = (statusCode) => (msg) => {
  const response = {
    headers,
    statusCode,
    body: JSON.stringify({
      statusCode,
      msg
    })
  };
  
  return response;
};

export const buildResponseError = (error: ResponseError) => {
  let statusCode = 500;
  if(error.name && error.name === 'ItemNotFoundException') statusCode = 404;
  else statusCode = error.code;

  const response = {
    headers,
    statusCode,
    body: JSON.stringify({
      statusCode,
      error: error.message
    })
  };
  
  return response;
};

export class ResponseError extends Error {
  code: number;

  constructor(code: number, message: string) {
    super(message);
    this.code = code;
    this.message = message;  
  }  
}

export const created = build(201);
export const success = build(200);
export const noContent = build(204);
export const badRequest = buildError(400);
export const unauthorized = buildError(401);
export const forbidden = buildError(403);
export const notFound = buildError(404);
export const notAcceptable = buildError(406);
export const failure = buildError(500);
