// src/logger.ts
import pino from 'pino';
import path from 'path';

const logPath = process.env.LOG_PATH || '/var/log/mini-lab/mini-lab-api.log';
const dest = pino.destination({dest: logPath, sync: false,     });

export const logger = pino({
    level: process.env.LOG_LEVEL || 'info',
    transport: process.env.NODE_ENV === 'development' ? { target: 'pino-pretty', options: { singleLine: true, colorize: true }, }: undefined }, 
    dest
);