import fs from 'fs';
import path from 'path';
import * as FileStreamRotator from 'file-stream-rotator';
import {__dirname} from '../file/index.js';

const logDirectory = path.join(__dirname(import.meta.url), '../../log/');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

const errorLogStream = FileStreamRotator.getStream({
    date_format: 'YYYY-MM-DD',
    filename: path.join(logDirectory, '%DATE%-error.log'),
    frequency: 'daily',
    audit_file: path.join(logDirectory, '/audit.json')
});

const accessLogStream = FileStreamRotator.getStream({
    date_format: 'YYYY-MM-DD',
    filename: path.join(logDirectory, '%DATE%-access.log'),
    frequency: 'daily',
    audit_file: path.join(logDirectory, '/audit.json')
});

export {
    errorLogStream,
    accessLogStream
}