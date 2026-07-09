import 'dotenv/config';
import { connectDatabase } from './config/db.js';
import app from './app.js';

const port = process.env.PORT || 5001;

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

// Connect to database and start server
try {
  await connectDatabase();
  
  const server = app.listen(port, () => {
    console.log(`✅ Dubai Global Express API running on port ${port}`);
    console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    console.log('🛑 SIGTERM received. Shutting down gracefully...');
    server.close(() => {
      console.log('✅ Server closed');
      process.exit(0);
    });
  });
} catch (error) {
  console.error('❌ Failed to start server:', error.message);
  process.exit(1);
}
