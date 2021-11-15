const catchAsync = require('../../appError/catchAsync');
const CrudWithAuth = require('../../CRUD Class/crudAuth');
const Authorize = require('../../middleware/authorization');
const userAuth = require('../../middleware/userAuth');
const Avatar = require('../../model/avatar/avatar');
const findByIdAndCheckExistence = require('../../util/findById');

const crud = new CrudWithAuth(Avatar, 'avatar/emoji');

const router = crud
  .postRouterWithAuth(userAuth, Authorize)
  .findAllRouter()
  .findOneRouter()
  .deleteRouterWithAuth(userAuth, Authorize)
  .readyRouter();

router.patch(
  '/api/avatar/emoji/choose/:id',
  userAuth,
  catchAsync(async (req, res, next) => {
    const avatarEmoji = await findByIdAndCheckExistence(
      Avatar,
      req.params.id,
      'Emoji Not Found'
    );

    await req.user.update({ image: avatarEmoji.emoji });

    res.send();
  })
);

module.exports = router;
