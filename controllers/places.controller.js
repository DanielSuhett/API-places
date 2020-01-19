const db = require('../database/db');
const { ErrorHandler } = require('../config/error');
const { getVotes, removeStorageFile } = require('./services')

exports.createPlace = async (req, res, next) => {
  try {
    const { place_name } = req.body;
    const { originalname: name, size, key, location: url = "", mimetype: type } = req.file;

    const image = JSON.stringify({
      name,
      size,
      key: req.file.key,
      url: req.file.location,
      type: req.file.mimetype
    });

    if (!place_name && !image)
      throw new ErrorHandler(401, "Para criar um novo lugar é necessário seu nome e o anexo de sua imagem!");
    else {
      if (!place_name)
        throw new ErrorHandler(401, "É necessário um nome para o lugar!");
      if (!image)
        throw new ErrorHandler(401, "É necessário anexar uma imagem ao lugar!");
    }

    const payload = { place_name, image, userId: req.userId, votes: 0 };

    const postCreate = () => {
      return new Promise((resolve, reject) => {
        db.query('INSERT INTO place SET ?',
          payload, (error, result) => {
            if (error)
              reject(new ErrorHandler(500, error));
            else
              resolve(result)
          });
      })
    }

    const result = await postCreate()

    if (result.affectedRows)
      res.status(201).send({
        createPlace: true,
        data: payload,
        at: new Date()
      });

    next();
  } catch (error) {
    next(error)
  }
}

exports.getPlaces = async (req, res, next) => {
  try {
    const findPlaces = () => {
      return new Promise((resolve, reject) => {
        db.query('SELECT * FROM place WHERE userId = ?',
          req.userId, (err, result) => {
            if (err)
              reject(new ErrorHandler(500, err));
            else
              resolve(result)
          });
      })
    }

    const result = await findPlaces()

    if (result.length === 0)
      throw new ErrorHandler(404, "Nenhum lugar encontrado!");
    else
      res.status(200).send(result);

    next();
  } catch (error) {
    next(error)
  }
};

exports.getPlace = async (req, res, next) => {
  try {
    const findPlace = async () => {
      return new Promise((resolve, reject) => {
        db.query('SELECT * FROM place WHERE _id = ? AND userId = ?',
          [req.params.id, req.userId], (err, result) => {
            if (err)
              reject(new ErrorHandler(500, err));
            else
              resolve(result)
          });
      })
    }

    const result = await findPlace()

    if (result.length === 0)
      throw new ErrorHandler(404, "Lugar não encontrado!");
    else
      res.status(200).send(result[0]);

    next();
  } catch (error) {
    next(error)
  }
};

exports.updatePlace = async (req, res, next) => {
  try {
    const { place_name, image, votes } = req.body;

    const updateResult = () => {
      return new Promise((resolve, reject) => {
        db.query('UPDATE place SET place_name = ?, image = ?, votes = ? WHERE _id = ? AND userId = ?',
          [place_name, JSON.stringify(image), votes, req.params.id, req.userId],
          (err, result) => {
            if (err)
              reject(new ErrorHandler(500, err));
            else
              resolve(result)
          });
      })
    }

    const result = await updateResult();
    // if(process.env.STORAGE_TYPE === 's3'){
    //   return 
    // } else {

    // }

    if (result.changedRows)
      res.status(200).send({
        update: true,
        message: result.message,
        update_at: new Date()
      });
    else
      throw new ErrorHandler(304, "Não foi possível atualizar!");

    next();
  } catch (error) {
    next(error)
  }
}

exports.votedPlace = async (req, res, next) => {
  try {
    let votes;

    const updateVotes = () => {
      return new Promise(async (resolve, reject) => {
        votes = await getVotes(req.params.id)
        if (votes.length) {
          db.query('UPDATE place SET votes = ? WHERE _id = ?',
            [votes[0].votes + 1, req.params.id],
            (err, result) => {
              if (err)
                reject(new ErrorHandler(500, err));
              else
                resolve(result)
            });
        }
      })
    }

    const result = await updateVotes();

    if (result.affectedRows || result.changedRows)
      res.status(200).send({
        voted: true,
        votes: votes[0].votes,
        update_at: new Date()
      });
    else
      throw new ErrorHandler(304, "Não foi possível votar!");

    next();
  } catch (error) {
    next(error)
  }
}

exports.deletePlace = async (req, res, next) => {
  try {

    const deletePlace = () => {
      return new Promise((resolve, reject) => {
        db.query('DELETE FROM place WHERE _id = ? AND userId = ?', [req.params.id, req.userId],
          (err, result) => {
            if (err)
              reject(new ErrorHandler(500, err));
            else
              resolve(result)
          });
      })
    }
    
    await removeStorageFile(req.params.id, req.userId);
    const result = await deletePlace();

    if (result.affectedRows)
      res.status(200).send({
        deleted: true,
        deleted_at: new Date()
      });
    else
      throw new ErrorHandler(404, "Não foi possível remover!");

    next()
  } catch (error) {
    next(error)
  }
};


