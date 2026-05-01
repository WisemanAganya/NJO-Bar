import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs, { existsSync } from "fs";
import axios from "axios";
import { config } from "dotenv";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import csurf from "csurf";
import rateLimit from "express-rate-limit";
import { body, validationResult } from "express-validator";
import compression from "compression";

config();

const requiredEnv = [
  'APP_URL',
  'MPESA_CONSUMER_KEY',
  'MPESA_CONSUMER_SECRET',
  'MPESA_PASSKEY',
  'MPESA_SHORTCODE'
];

const missingEnv = requiredEnv.filter((key) => !process.env[key]);
const isProduction = process.env.NODE_ENV === 'production';

if (missingEnv.length && isProduction) {
  console.error(`Missing required production environment variables: ${missingEnv.join(', ')}`);
  process.exit(1);
}

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || '3002', 10);
  const appUrl = process.env.APP_URL || `http://localhost:${PORT}`;
  const allowedOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',').map((origin) => origin.trim()).filter(Boolean)
    : isProduction
    ? ['https://yourdomain.com']
    : ['http://localhost:3000', 'http://localhost:5173'];

  app.disable('x-powered-by');
  app.set('trust proxy', 1);

  // Cookie parser required for CSRF protection
  app.use(cookieParser());

  console.log(`[Server] Environment: ${isProduction ? 'Production' : 'Development'}`);

  // Security middleware - Only active in production to prevent dev HMR blocks
  if (isProduction) {
    app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
          fontSrc: ["'self'", "https://fonts.gstatic.com"],
          imgSrc: ["'self'", "data:", "https:", "blob:"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          connectSrc: ["'self'", "https://yaayhklbardauhskrgyu.supabase.co"],
        },
      },
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true
      }
    }));
    console.log('[Server] Production security headers active.');
  } else {
    app.use((req, res, next) => {
      res.removeHeader("Content-Security-Policy");
      next();
    });
    console.log('[Server] Development mode: Security headers disabled for HMR compatibility.');
  }

  // CORS configuration
  app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-CSRF-Token']
  }));

  // CSRF protection for API routes
  app.use('/api/', csurf({
    cookie: {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'strict',
      maxAge: 60 * 60 * 1000,
    },
  }));

  app.get('/api/csrf-token', (req: any, res: any) => {
    res.json({ csrfToken: req.csrfToken() });
  });

  // Redirect to HTTPS when enabled
  if (isProduction && process.env.FORCE_HTTPS === 'true') {
    app.use((req: any, res: any, next: any) => {
      const forwardedProto = req.headers['x-forwarded-proto'];
      if (req.secure || forwardedProto === 'https') {
        return next();
      }
      return res.redirect(301, `https://${req.headers.host}${req.url}`);
    });
  }

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use('/api/', limiter);

  // Stricter rate limiting for auth endpoints
  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 auth attempts per windowMs
    message: 'Too many authentication attempts, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  });
  app.use('/api/auth/', authLimiter);

  // Compression
  app.use(compression());

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // M-Pesa Auth Helper
  const getMpesaToken = async () => {
    const consumerKey = process.env.MPESA_CONSUMER_KEY;
    const consumerSecret = process.env.MPESA_CONSUMER_SECRET;
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");

    try {
      const response = await axios.get(
        "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
        {
          headers: {
            Authorization: `Basic ${auth}`,
          },
        }
      );
      return response.data.access_token;
    } catch (error: any) {
      console.error("M-Pesa Token Error:", error.response?.data || error.message);
      throw new Error("Failed to get M-Pesa access token");
    }
  };

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  });

  // API routes
  app.post(
    "/api/mpesa/stk-push",
    [
      body('phoneNumber').matches(/^254[0-9]{9}$/).withMessage('Phone number must use Kenyan format 254XXXXXXXXX'),
      body('amount').isInt({ min: 1, max: 150000 }).withMessage('Amount must be between 1 and 150000'),
      body('bookingId').isString().notEmpty().withMessage('Booking ID is required'),
    ],
    async (req: any, res: any) => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
        }

        const { phoneNumber, amount, bookingId } = req.body;

        const token = await getMpesaToken();

        const shortCode = process.env.MPESA_SHORTCODE || "174379";
        const passkey = process.env.MPESA_PASSKEY;
      const timestamp = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 14);
      const password = Buffer.from(`${shortCode}${passkey}${timestamp}`).toString("base64");

      const response = await axios.post(
        "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
        {
          BusinessShortCode: shortCode,
          Password: password,
          Timestamp: timestamp,
          TransactionType: "CustomerPayBillOnline",
          Amount: amount,
          PartyA: phoneNumber,
          PartyB: shortCode,
          PhoneNumber: phoneNumber,
          CallBackURL: `${process.env.APP_URL}/api/mpesa/callback`,
          AccountReference: `NJO-${bookingId}`,
          TransactionDesc: "Booking Deposit",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      res.json(response.data);
    } catch (error: any) {
      console.error("M-Pesa STK Push Error:", error.response?.data || error.message);
      res.status(500).json({ error: error.response?.data || error.message });
    }
  });

  app.post("/api/mpesa/callback", (req, res) => {
    console.log("M-Pesa Callback Received:", JSON.stringify(req.body, null, 2));
    // TODO: In production, validate the callback and update Supabase securely
    res.json({ ResultCode: 0, ResultDesc: "Success" });
  });

  app.get('/api/openapi.json', (req, res) => {
    res.json({
      openapi: '3.0.0',
      info: {
        title: 'NJO Bar API',
        version: '1.0.0',
        description: 'Minimal production API docs for NJO Bar backend services.',
      },
      paths: {
        '/api/health': {
          get: {
            summary: 'Service health check',
            responses: { '200': { description: 'OK' } },
          },
        },
        '/api/csrf-token': {
          get: {
            summary: 'Fetch CSRF token for client forms',
            responses: { '200': { description: 'Generated CSRF token' } },
          },
        },
        '/api/mpesa/stk-push': {
          post: {
            summary: 'Initiate M-Pesa STK Push payment request',
            requestBody: {
              required: true,
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      phoneNumber: { type: 'string' },
                      amount: { type: 'integer' },
                      bookingId: { type: 'string' },
                    },
                  },
                },
              },
            },
            responses: {
              '200': { description: 'STK push initiated' },
              '400': { description: 'Validation error' },
            },
          },
        },
      },
    });
  });

  app.get('/robots.txt', (req, res) => {
    res.type('text/plain').send('User-agent: *\nDisallow: /api/private\n');
  });

  app.get('/sitemap.xml', (req, res) => {
    const baseUrl = appUrl;
    const pages = ['/', '/#bookings', '/#catalog', '/#packages', '/#portfolio', '/#blog', '/#contact'];
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages
      .map((page) => `  <url>\n    <loc>${baseUrl}${page}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>`)
      .join('\n')}\n</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(sitemap);
  });

  // Serve frontend
  const distPath = path.join(process.cwd(), 'dist');
  const indexFile = path.join(distPath, 'index.html');

  if (!isProduction) {
    // In development, use Vite's dev middleware
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        hmr: { port: 5173 }
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);

    app.get('*', async (req, res, next) => {
      try {
        const url = req.originalUrl;
        const html = await fs.promises.readFile(path.join(process.cwd(), 'index.html'), 'utf-8');
        const marker = `<!-- NJO-PRO-V1 -->`;
        const transformedHtml = (await vite.transformIndexHtml(url, html)).replace('<head>', `<head>${marker}`);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(transformedHtml);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else if (existsSync(indexFile)) {
    app.use(express.static(distPath, { maxAge: '1d' }));
    app.get('*', (req, res) => {
      res.sendFile(indexFile);
    });
  } else {
    console.error('Production build not found. Run `npm run build` before starting the server.');
    process.exit(1);
  }

  // Global error handler
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Error:', err);
    
    // Don't leak error details in production
    const isDevelopment = process.env.NODE_ENV !== 'production';
    
    res.status(err.status || 500).json({
      message: isDevelopment ? err.message : 'Internal server error',
      ...(isDevelopment && { stack: err.stack })
    });
  });

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
  });

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on ${process.env.NODE_ENV === 'production' ? 'production' : 'development'} mode at http://localhost:${PORT}`);
  });
}

startServer();
