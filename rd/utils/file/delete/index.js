import fs from 'fs';
import path from 'path';
import {__dirname} from '../__dirname/index.js';

const deteleFileAsync = (pathName) => {
    if (!pathName) return;
    pathName = path.join(__dirname(import.meta.url), '../../../public/images' + pathName.split('images')[1]);
    fs.unlink(pathName, err => {
        if (err)  {
            console.log(`unlink file ${pathName} failed ${err}`);
            return;
        }
        console.log(`unlink file ${pathName} successed`);
    });
}

export {
    deteleFileAsync
}