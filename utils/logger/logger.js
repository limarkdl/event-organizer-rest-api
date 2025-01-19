import {createLogger, format, transports} from 'winston';

const customFormat = format.combine(
    format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
    format.printf(({timestamp, level, message, stack}) => {
        return stack
            ? `${timestamp} [${level.toUpperCase()}]: ${message}\n${stack}`
            : `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
);

const logger = createLogger({
    level: 'info',
    format: customFormat,
    transports: [
        new transports.Console({
            format: format.combine(
                format.colorize(),
                customFormat
            ),
        }),
        new transports.File({filename: 'logs/error.log', level: 'error'}),
        new transports.File({filename: 'logs/combined.log'})
    ],
    exceptionHandlers: [
        new transports.File({filename: 'logs/exceptions.log'})
    ],
    rejectionHandlers: [
        new transports.File({filename: 'logs/rejections.log'})
    ]
});

export default logger;