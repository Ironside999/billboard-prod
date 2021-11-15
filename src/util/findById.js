const AppError = require("../appError/appError");

const findByIdAndCheckExistence = async (model, id, message = "NOT FOUND") => {
  try {
    const instanceOfModel = await model.findByPk(id);

    if (!instanceOfModel) throw new AppError(message, 404);

    return instanceOfModel;
  } catch (err) {
    throw err;
  }
};

module.exports = findByIdAndCheckExistence;
