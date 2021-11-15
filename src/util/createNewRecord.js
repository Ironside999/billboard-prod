const createNewRecord = async (model, obj) => {
  try {
    const instanceOfModel = await model.create(obj);

    return instanceOfModel;
  } catch (err) {
    throw err;
  }
};

module.exports = createNewRecord;
