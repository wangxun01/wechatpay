import {dirname} from 'path';
import {fileURLToPath} from 'url';

const __dirname = (url) => {
    const __filename = fileURLToPath(url);
    return dirname(__filename);
}

export {
    __dirname
}