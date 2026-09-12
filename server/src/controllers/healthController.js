import { checkDBStatus } from '../config/db.js';

export const getHealth = (req, res) => {
  const dbStatus = checkDBStatus();
  
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    dbStatus: dbStatus,
    environment: process.env.NODE_ENV || 'development',
    service: 'TaskFlow API Server'
  });
};
