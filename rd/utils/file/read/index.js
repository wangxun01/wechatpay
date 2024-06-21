import fs from 'fs';

const getBase64 = path => {
    if (!path) return;

    let data = fs.readFileSync(path);
    data = Buffer.from(data).toString('base64');
    return data;
}

const getFile = path => {
    if (!path) return;
    return fs.readFileSync(path);
}

export {
    getBase64,
    getFile
}