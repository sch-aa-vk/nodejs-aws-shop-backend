function createResponse(statusCode: number, body: any, headers: { [key: string]: string } = {}): { statusCode: number, headers: { [key: string]: string }, body: string } {
  return {
    statusCode,
    headers: { 
      'Content-Type': 'application/json', 
      'Access-Control-Allow-Origin': '*', 
      ...headers
    },
    body: JSON.stringify(body),
  };
}

export function createSuccessResponse(body: any, headers: { [key: string]: string } = {}) {
  return createResponse(200, body, headers);
}

export function createNotFoundResponse(body: any, headers: { [key: string]: string } = {}) {
  return createResponse(404, body, headers);
}

export function createErrorResponse(body: any, headers: { [key: string]: string } = {}) {
  return createResponse(500, body, headers);
}