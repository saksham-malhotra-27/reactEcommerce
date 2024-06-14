// types/express.d.ts
import * as express from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: any; // Adjust the type according to your needs
    }
  }
}
