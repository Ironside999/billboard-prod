const express = require('express');
const AppError = require('../../appError/appError');
const catchAsync = require('../../appError/catchAsync');
const userAuth = require('../../middleware/userAuth');
const Ad = require('../../model/ads/ad');
const Note = require('../../model/note/note');
const createNewRecord = require('../../util/createNewRecord');

const router = new express.Router();

router.post(
  '/api/user/note/add',
  userAuth,
  catchAsync(async (req, res, next) => {
    const note = await Note.findOne({
      where: {
        frkAd: req.body.frkAd,
        frkUser: req.user.id,
      },
    });

    if (note) {
      const updatedNote = await note.update({ note: req.body.note });
      return res.send(updatedNote);
    }

    const myNote = await createNewRecord(Note, {
      frkUser: req.user.id,
      frkAd: req.body.frkAd,
      note: req.body.note,
    });

    res.status(201).send(myNote);
  })
);

router.delete(
  '/api/user/note/delete/:id',
  userAuth,
  catchAsync(async (req, res, next) => {
    const myNote = await Note.destroy({
      where: {
        frkUser: req.user.id,
        id: req.params.id,
      },
    });

    if (!myNote)
      return next(new AppError('NOT FOUND SUCH NOTE FOR THIS USER', 404));

    res.send();
  })
);

router.get(
  '/api/user/all/notes',
  userAuth,
  catchAsync(async (req, res, next) => {
    const notes = await Note.findAll({
      where: {
        frkUser: req.user.id,
      },
      include: {
        model: Ad,
      },
    });

    res.send(notes);
  })
);

router.get(
  '/api/note/by/user/:id',
  userAuth,
  catchAsync(async (req, res, next) => {
    const note = await Note.findOne({
      where: {
        frkAd: req.params.id,
        frkUser: req.user.id,
      },
    });

    if (!note) return next(new AppError('Not Found Note', 404));

    res.status(200).send(note);
  })
);

module.exports = router;
