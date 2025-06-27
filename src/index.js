import express from 'express';
import { sequelize } from './config/database';
const cookieParser = require("cookie-parser");
import authRoutes from './routes/auth.routes';
import courseRoutes from './routes/course.routes';
import studentRoutes from './routes/students.routes';
import courseContentRoutes from "./routes/coursecontent.routes";
import progressRoutes from "./routes/progress.routes";
import assignmentRoutes from './routes/assignment.routes';
import "../src/cron/cron-notifications";
import { swaggerUi, specs } from "./swagger";

const app = express();
const PORT = process.env.PORT || 3007;

app.use(express.json());
app.use(cookieParser());

app.use("/api-doc", swaggerUi.serve, swaggerUi.setup(specs));
app.use('/users', authRoutes);
app.use('/courses', courseRoutes);
app.use('/courses', assignmentRoutes);
app.use('/coursecontent', courseContentRoutes);
app.use('/student', studentRoutes);
app.use('/student', assignmentRoutes);
app.use('/enrollcourses', progressRoutes);

// Database connection and sync
const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log('✅ Database connected');
  } catch (err) {
    console.error('❌ Failed to connect to the database:', err);
  }
};

// Start the database connection
start();

// Export the app for Vercel
export default app;
