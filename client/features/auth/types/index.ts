export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  session_id: string | null;
  session_expiry: string | null;
  createdAt: string;
}

