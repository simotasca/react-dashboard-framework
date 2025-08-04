export type ServiceResponse<T = any> = {
  body: T;
  status: number;
  statusText: string;
  url: string;
  headers: Headers;
  redirected: boolean;
  type: ResponseType;
};

/**
 * This class assumes that all http requests return data in JSON format, both for success and error.
 * 
 * _example usage:_
 * ```
 * const service = new Service("hhppp:///we.demodemo.com", { credentials: "include" });
 * export const api = {
 *   companies: {
 *     list: () => service.get<string[]>("/companies/list"),
 *   },
 * };
 * ```
 * 
 */
export default class Service {
  constructor(private baseUrl: string, private defaultFetchOptions?: RequestInit) {}

  public async get<T = any>(path: string) { return this.fetch<T>(path); }
  public async post<T = any>(path: string, body?: any) { return this.fetch<T>(path, "POST", body); }
  public async put<T = any>(path: string, body?: any) { return this.fetch<T>(path, "PUT", body); }
  public async patch<T = any>(path: string, body?: any) { return this.fetch<T>(path, "PATCH", body); }
  public async delete<T = any>(path: string, body?: any) { return this.fetch<T>(path, "DELETE", body); }

  public async fetch<T = any>(path: string, method = "GET", body?: any) {
    return fetch(this.baseUrl + path, {
      ...(this.defaultFetchOptions || {}),
      method,
      body: body && JSON.stringify(body),
    }).then(this.parseJsonResponse<T>);
  }

  private async parseJsonResponse<T>(res: Response): Promise<ServiceResponse<T>> {
    const r = {
      body: await res.json(),
      status: res.status,
      statusText: res.statusText,
      url: res.url,
      headers: res.headers,
      redirected: res.redirected,
      type: res.type,
    };
    if (!res.ok) throw r;
    return r;
  }
}
