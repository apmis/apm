export interface HttpRequest {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  query?: Record<string, string>;
  headers?: Record<string, string>;
  body?: unknown;
}

export interface HttpResponse {
  status: number;
  body: unknown;
  headers: Record<string, string>;
}

export interface TestContext {
  request(req: HttpRequest): Promise<HttpResponse>;
  asAdmin(): Promise<TestContext>;
  asPublic(): TestContext;
  asUser(email: string, password: string): Promise<TestContext>;
  seed(): Promise<void>;
  cleanup(): Promise<void>;
}
