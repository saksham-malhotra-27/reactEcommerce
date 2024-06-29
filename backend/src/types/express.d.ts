// types/express.d.ts
import * as express from 'express';

interface User {
  id:      string,
  email:   string, 
  location:string,
  role:    number,
  phone:   string,
}

declare global {
  namespace Express {
    interface Request {
      user?: User; // Adjust the type according to your needs
    }
  }
}
