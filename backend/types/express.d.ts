declare global {
  namespace Express {
    interface User {
      _id: string;
      email: string;
      role: string;
    }

    interface Request {
      user?: User;
      logout: (callback: (err?: any) => void) => void;
      session?: {
        destroy: (callback: (err?: any) => void) => void;
      };
    }
  }
}

export {};

