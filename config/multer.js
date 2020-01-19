const multer = require('multer')
const path = require('path');
const aws = require('aws-sdk');
const multerS3 = require('multer-s3')
const { ErrorHandler } = require('../config/error');

const fileNameFormat = (file) => {
    file.key = `${file.originalname.substring(0, file.originalname.length - 4)}${Date.now()}${path.extname(file.originalname)}`.replace(/\s+/g, '')
    return file.key
}

const storageTypes = {
    local: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, path.resolve(__dirname, '..', 'tmp'));
        },
        filename: function (req, file, cb) {
            cb(null, fileNameFormat(file))
        }
    }),
    s3: multerS3({
        s3: new aws.S3({
            accessKeyId: process.env.AWS_ACCESS_KEY,
            secretAccessKey: process.env.AWS_SECRET_KEY
        }),

        bucket: 'playerum-task',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: 'public-read',
        key: (req, file, cb) => {
            try {
                cb(null, fileNameFormat(file))
            } catch (error) {
                throw new ErrorHandler(error)
            }
        }
    })
}

module.exports = {
    dest: path.resolve(__dirname, '..', "tmp"),
    storage: storageTypes[process.env.STORAGE_TYPE || 'local'],
    limits: {
        fileSize: 2 * 1024 * 1024
    },
    fileFilter: function (req, file, cb) {
        const allowed = [
            'image/jpeg',
            'image/pjpeg',
            'image/png',
            'image/gif'
        ];

        if (allowed.includes(file.mimetype))
            cb(null, true)
        else
            cb(new ErrorHandler(401, "Tipo de imagem não permitido!"))
    }
}