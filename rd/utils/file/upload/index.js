import multer from 'multer';
import path from 'path';
import {__dirname} from '../__dirname/index.js';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname(import.meta.url), '../../../public/images'));
    },
    filename: function (req, file, cb) {
        const [filename, extname] = file.originalname.split('.');
        cb(null, `${filename}-${Date.now()}.${extname}`);
    }
});

const limits = {
    files: 1,
    fileSize: 1024 * 1024 * 2
};

const filter = (req, file, cb) => {
    const fileTypeArry = ['.jpg', '.jpeg', '.png'];
    const extname = path.extname(file.originalname);
    cb(null, fileTypeArry.includes(extname));
};

const upload = multer({
    storage,
    limits,
    filter
}).single('customFile'); // 前端上传文件的字段名必须和'customFile'保持一致

const fileUploadHandler = upload;

export {
    fileUploadHandler
}