import express, {type Application } from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import compression from "compression";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { globalErrorHandler } from "./middlewares/error.middleware";
import { notFoundHandler } from "./middlewares/notfound.middleware";
import { env } from "./config/env";
import { connectDatabase } from "./config/database";
import { router as apiRouter } from "./routes";
import { initDefaultAdmin } from "./utils/initDefaultAdmin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = env.port;

const app: Application = express();

app.use(helmet());
app.use(
  cors({
    origin: env.frontendUrl || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compression());
app.use(morgan("dev"));

app.use(
  session({
    secret: env.jwtSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: env.nodeEnv === "production",
      httpOnly: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      ...(env.cookieDomain && { domain: env.cookieDomain }),
    },
  })
);


// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api", apiRouter);

app.get("/health", (req, res) => {
  res.send("Server is running");
});

app.use(globalErrorHandler);
app.use(notFoundHandler);


async function start() {
  try {
    await connectDatabase();
    console.log("MongoDB connected");

    // Initialize default admin user if no users exist
    await initDefaultAdmin();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

start();
