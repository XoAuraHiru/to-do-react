import { createLogger, format as _format, transports as _transports } from 'winston';

const logger = createLogger({
    level: 'info',
    format: _format.combine(
        _format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        _format.errors({ stack: true }),
        _format.splat(),
        _format.json()
    ),
    defaultMeta: { service: 'todo-app' },
    transports: [

        new _transports.File({
            filename: 'logs/error.log',
            level: 'error',
            format: _format.combine(
                _format.timestamp(),
                _format.json()
            )
        }),

        new _transports.File({
            filename: 'logs/combined.log',
            format: _format.combine(
                _format.timestamp(),
                _format.json()
            )
        })
    ]
});

// when not in production, log to console
if (process.env.NODE_ENV !== 'production') {
    logger.add(new _transports.Console({
        format: _format.combine(
            _format.colorize(),
            _format.simple(),
            _format.printf(({ level, message, timestamp, ...metadata }) => {
                let msg = `${timestamp} ${level}: ${message}`;
                if (Object.keys(metadata).length > 0 && metadata.service === undefined) {
                    msg += ` ${JSON.stringify(metadata)}`;
                }
                return msg;
            })
        )
    }));
}

export default logger;