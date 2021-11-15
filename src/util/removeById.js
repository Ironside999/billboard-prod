const AppError = require('../appError/appError');
const { deleteSingleObject } = require('./deleteArvanObject');

const checkExistenceAndRemove = async (model, id) => {
  try {
    const instanceOfModel = await model.findByPk(id);

    if (!instanceOfModel) throw new AppError('NOT FOUND', 404);

    if (instanceOfModel.image) {
      deleteSingleObject({
        Bucket: process.env.BILLBOARD_BUCKET,
        Key: instanceOfModel.image,
      });
    }

    await instanceOfModel.destroy();

    return instanceOfModel;
  } catch (err) {
    throw err;
  }
};

module.exports = checkExistenceAndRemove;
