const db = require('../database/db');
const { ErrorHandler } = require('../config/error');
const { getVotes } = require('./services')

exports.vote = async (req, res, next) => {
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

  exports.getPlacesToVote = async (req, res, next) => {
    try {
      const findPlaces = () => {
        return new Promise((resolve, reject) => {
          db.query('SELECT * FROM place WHERE userId = ?',
            req.params.id, (err, result) => {
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