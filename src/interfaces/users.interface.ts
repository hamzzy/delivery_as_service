export interface User {
  id: string;
  email: string;
  password: string;
}

export interface CustomerApi {
  id: string;
  apiKey: string;
  customer: any;
}