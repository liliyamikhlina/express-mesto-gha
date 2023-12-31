const mongoose = require('mongoose');
const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({
    name,
    link,
    owner: req.user._id,
  })
    .then((card) => res.status(201).json({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(400)
          .send({
            message: 'Переданы некорректные данные при создании карточки',
          });
      }
      return res.status(500).send({ message: err.message });
    });
};

module.exports.deleteCard = (req, res) => {
  const userId = req.user._id;
  if (!mongoose.Types.ObjectId.isValid(req.params.cardId)) {
    return res
      .status(400)
      .send({ message: 'Переданы некорректные данные при удалении карточки' });
  }

  return Card.findByIdAndDelete(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res
          .status(404)
          .send({ message: 'Карточка с указанным _id не найдена' });
      }
      if (card.owner.toString() !== userId) {
        return res
          .status(403)
          .send({ message: 'Недостаточно прав для удаления этой карточки' });
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res
          .status(404)
          .send({ message: 'Передан несуществующий _id карточки' });
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(400).send({ message: 'Переданы некорректные данные для постановки лайка' });
      }
      return res.status(500).send({ message: err.message });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(404).send({ message: 'Передан несуществующий _id карточки' });
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Переданы некорректные данные для снятия лайка' });
      }
      return res.status(500).send({ message: err.message });
    });
};
