import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const client = jwksClient({
  jwksUri: `https://jzufgvdalkcwslmaqdvz.supabase.co/auth/v1/.well-known/jwks.json`,
  requestHeaders: {
    'apikey': (process.env.SUPABASE_ANON_KEY || '').trim()
  },
  cache: true,
  rateLimit: true,
  jwksRequestsPerMinute: 5
});

function getKey(header: any, callback: any) {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      console.error(`[Auth] JWKS getSigningKey error:`, err.message);
      callback(err);
    } else {
      const signingKey = key?.getPublicKey();
      callback(null, signingKey);
    }
  });
}

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.error('[Auth] No token provided');
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify token using JWKS (automatic key discovery)
    jwt.verify(token, getKey, { algorithms: ['ES256', 'HS256'] }, (err, decoded) => {
      if (err) {
        console.error('[Auth] Token verification failed:', err.message);
        return res.status(401).json({ error: `Unauthorized: ${err.message}` });
      }
      
      req.user = decoded; // Contains user info (like sub as the user id)
      next();
    });
  } catch (error: any) {
    console.error('[Auth] Unexpected error:', error.message);
    return res.status(401).json({ error: `Unauthorized: ${error.message}` });
  }
};
