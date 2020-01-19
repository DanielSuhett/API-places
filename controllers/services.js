const fs = require('fs');
const path = require('path');
const aws = require('aws-sdk');
const db = require('../database/db');
const { ErrorHandler } = require('../config/error')

function getKey(_id, userId) {
    return new Promise((resolve, reject) => {
        db.query('SELECT image FROM place WHERE _id = ? AND userId = ?', [_id, userId],
            (err, result) => {
                if (err)
                    reject(new ErrorHandler(500, err));
                else {
                    if (!result.length)
                        reject(new ErrorHandler(500, "Não existe arquivo a ser deletado!"))
                    else
                        resolve(JSON.parse(result[0].image).key)
                }
            });
    })
}

async function removeStorageFile(_id, userId) {
    const key = await getKey(_id, userId);
    const s3 = new aws.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY
    });

    if (process.env.STORAGE_TYPE === 's3') {
      return new Promise((resolve, reject) => {
        s3.deleteObject({
            Bucket: 'playerum-task',
            Key: key
        }, (err, result) => {
          if(err)
            reject(new ErrorHandler(500, err));
          else
            resolve(result);
        })
      })
    } else {
        return new Promise((resolve, reject) => {
            fs.unlink(path.resolve(__dirname, '..', 'tmp', key), (err, result) => {
                if (err)
                    reject(new ErrorHandler(500, err));
                resolve();
            })
        })
    }
}

const getVotes = async (_id) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT votes FROM place WHERE _id = ?',
        _id,
            (err, result) => {
                if (err)
                    reject(new ErrorHandler(500, err));
                else
                    resolve(result)
            });
    })
}

const validatePayload = async (username, password, passwordConfirm) => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM user WHERE username = ?', username, ((err, user) => {
        if (user && user.length)
          reject(new ErrorHandler(401, "Usuário já existe!"));
        else {
          if (password && passwordConfirm) {
            if (password != passwordConfirm)
              reject(new ErrorHandler(401, "Senhas Incompatíveis"));
            else
              resolve();
          } else
            reject(new ErrorHandler(401, "Confirme sua senha!"));
        }
      }))
    })
  };

  const FindUser = async (_id) => {
    return new Promise((resolve, reject) => {
      db.query('SELECT * FROM user WHERE _id = ?', _id, async (err, result) => {
        if (err)
          reject(new ErrorHandler(500, err));
        else
          resolve(result)
      });
    })
  };

module.exports = {
    removeStorageFile,
    getVotes,
    validatePayload,
    FindUser
}
