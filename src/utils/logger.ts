import pino from 'pino';

const isCI = process.env.CI === 'true';
const isDev = process.env.NODE_ENV === 'development';
const logPath = process.env.LOG_PATH || '/var/log/mini-lab/mini-lab-api.log';

const dest = pino.destination({
  dest: logPath,
  sync: true,
  mkdir: true
});

const logger = pino({
    level: process.env.LOG_LEVEL || 'info',
    transport: isDev
        ? { target: 'pino-pretty', options: { singleLine: true, colorize: true } }
        : undefined,
}, isCI ? undefined : pino.destination({
    dest: process.env.LOG_PATH || '/var/log/mini-lab/mini-lab-api.log',
    sync: false,
}));

export { logger };