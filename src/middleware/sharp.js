const sharp = require("sharp");
const path = require("path");
const AppError = require("../appError/appError");

exports.formatAvatar = async (req, res, next) => {
  if (!req.file) return next();

  req.body.avatar = `/user/user-${req.file.fieldname}-${req.user.id}.jpeg`;

  try {
    await sharp(req.file.buffer)
      .resize(200, 200)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`${path.join(__dirname, "../../public/photos" + req.body.avatar)}`);

    next();
  } catch (err) {
    res.status(400).send({ error: err.name });
  }
};

exports.formatBusinessImg = async (req, res, next) => {
  if (!req.file) return next();

  req.body.businessImage = `/business-info/business-${req.file.fieldname}-${req.user.id}.jpeg`;

  try {
    await sharp(req.file.buffer)
      .resize(200, 200)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`${path.join(__dirname, "../../public/photos" + req.body.businessImage)}`);

    next();
  } catch (err) {
    res.status(400).send({ error: err.name });
  }
};

exports.formatAdPackageImg = async (req, res, next) => {
  if (!req.file) return next();

  req.body.image = `/ad-package/package-${req.file.fieldname}-${req.file.originalname}.jpeg`;

  try {
    await sharp(req.file.buffer)
      .resize(200, 200)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`${path.join(__dirname, "../../public/photos" + req.body.image)}`);

    next();
  } catch (err) {
    res.status(400).send({ error: err.name });
  }
};

exports.formatAdImages = async (req, res, next) => {
  if (!req.files || !req.files?.length) return next();

  try {
    await Promise.all(
      req.files.map(async (img, indx) => {
        const filename = `/ads/ad-${img.fieldname}-${indx + 1}-${
          req.user.id
        }-${Date.now()}.jpeg`;

        await sharp(img.buffer)
          .resize(400, 400)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(`${path.join(__dirname, "../../public/photos" + filename)}`);

        req.body["img" + indx] = filename;
      })
    );

    next();
  } catch (err) {
    res.status(400).send({ error: err.name });
  }
};

exports.formatAuthorImg = async (req, res, next) => {
  if (!req.file) return next();

  req.body.avatar = `/author/author-${Date.now()}.jpeg`;

  try {
    await sharp(req.file.buffer)
      .resize(200, 200)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`${path.join(__dirname, "../../public/photos" + req.body.avatar)}`);

    next();
  } catch (err) {
    res.status(400).send({ error: err.name });
  }
};

exports.formatBlogImg = async (req, res, next) => {
  if (!req.file) return next();

  req.body.photo = `/blog/blog-${req.file.originalname}-${Date.now()}.jpeg`;

  try {
    await sharp(req.file.buffer)
      .resize(800, 800)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`${path.join(__dirname, "../../public/photos" + req.body.photo)}`);

    next();
  } catch (err) {
    res.status(400).send({ error: err.name });
  }
};

exports.formatBbdFinderImages = async (req, res, next) => {
  if (!req.files || !req.files?.length) return next();

  try {
    await Promise.all(
      req.files.map(async (img, indx) => {
        const filename = `/bbd-finder/billboad-ad-${img.fieldname}-${
          indx + 1
        }-${req.user.id}-${Date.now()}.jpeg`;

        await sharp(img.buffer)
          .resize(400, 400)
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(`${path.join(__dirname, "../../public/photos" + filename)}`);

        req.body["img" + indx] = filename;
      })
    );

    next();
  } catch (err) {
    res.status(400).send({ error: err.name });
  }
};

exports.formatVirtualBillboardDesign = async (req, res, next) => {
  //remove height width
  if (!req.file) return next();

  req.body.image = `/virtual-bbd-sample/sample-${
    req.file.originalname
  }-${Date.now()}.jpeg`;

  try {
    await sharp(req.file.buffer)
      // .resize(req.body.width, req.body.height)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`${path.join(__dirname, "../../public/photos" + req.body.image)}`);

    next();
  } catch (err) {
    res.status(400).send({ error: err.name });
  }
};

exports.formatVirtualBbdCover = async (req, res, next) => {
  if (!req.file || !req.body.width || !req.body.height) return next();

  req.body.cover = `/virtual-bbd-cover/cover-${
    req.file.originalname
  }-${Date.now()}.jpeg`;

  try {
    await sharp(req.file.buffer)
      .resize(req.body.width, req.body.height)
      .toFormat("jpeg")
      .jpeg({ quality: 90 })
      .toFile(`${path.join(__dirname, "../../public/photos" + req.body.cover)}`);

    next();
  } catch (err) {
    res.status(400).send({ error: err.name });
  }
};

exports.formatImg = (folder, prefixName) => {
  return async (req, res, next) => {
    if (!req.file) return next();

    req.body[prefixName] = `/${folder}/${prefixName}-${
      req.file.fieldname
    }-${Date.now()}.jpeg`;

    try {
      await sharp(req.file.buffer)
        // .resize(+req.body.width, +req.body.height)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`${path.join(__dirname, "../../public/photos" + req.body[prefixName])}`);

      next();
    } catch (err) {
      console.log(err);
      res.status(400).send({ error: "Image Issue" });
    }
  };
};

exports.formatImage = (folder) => {
  return async (req, res, next) => {
    if (!req.file) return next();

    req.body[req.file.fieldname] = `/${folder}/${
      req.file.fieldname
    }-${req.file.originalname.replace(/\.\w+$/, "")}-${Date.now()}.jpeg`;

    try {
      await sharp(req.file.buffer)
        .resize(
          req.body[req.file.fieldname + "Width"],
          req.body[req.file.fieldname + "Height"]
        )
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(
          `${path.join(__dirname, "../../public/photos" + req.body[req.file.fieldname])}`
        );

      next();
    } catch (err) {
      res.status(400).send({ error: "Image Issue" });
    }
  };
};

exports.formatFields = (folder, ...args) => {
  return async (req, res, next) => {
    const fields = [];

    for (let arg of args) {
      if (req.files[arg]?.[0]) {
        fields.push(req.files[arg][0]);
      }
    }

    if (!fields.length) return next();

    try {
      await Promise.all(
        fields.map(async (img) => {
          const filename = `/${folder}/${
            img.fieldname
          }-${img.originalname.replace(/\.\w+$/, "")}-${Date.now()}.jpeg`;

          try {
            await sharp(img.buffer)
              .resize(
                req.body[img.fieldname + "Width"],
                req.body[img.fieldname + "Height"]
              )
              .toFormat("jpeg")
              .jpeg({ quality: 90 })
              .toFile(`${path.join(__dirname, "../../public/photos" + filename)}`);

            req.body[img.fieldname] = filename;
          } catch (err) {
            throw err;
          }
        })
      );

      next();
    } catch (err) {
      res.status(400).send({ error: err.name });
    }
  };
};

exports.formatMultipleFields = (folder, ...args) => {
  return async (req, res, next) => {
    const singleField = [];

    const multipleFields = [];

    for (let arg of args) {
      if (req.files?.[arg]?.length == 1) {
        singleField.push(req.files[arg][0]);
      } else if (req.files?.[arg]?.length > 1) {
        req.files[arg].forEach((itm) => {
          multipleFields.push(itm);
        });
      }
    }

    if (!singleField.length && !multipleFields.length) return next();

    if (singleField.length > 1)
      return next(
        new AppError("Sub images should be more than one or none", 400)
      );

    try {
      if (singleField.length) {
        const filename = `/${folder}/${
          singleField[0].fieldname
        }-${singleField[0].originalname.replace(
          /\.\w+$/,
          ""
        )}-${Date.now()}.jpeg`;

        await sharp(singleField[0].buffer)
          .resize(
            req.body[singleField[0].fieldname + "Width"],
            req.body[singleField[0].fieldname + "Height"]
          )
          .toFormat("jpeg")
          .jpeg({ quality: 90 })
          .toFile(`${path.join(__dirname, "../../public/photos" + filename)}`);

        req.body[singleField[0].fieldname] = filename;
      }

      if (multipleFields.length) {
        req.body.arrayImages = [];

        await Promise.all(
          multipleFields.map(async (img) => {
            const filename = `/${folder}/${
              img.fieldname
            }-${img.originalname.replace(/\.\w+$/, "")}-${Date.now()}.jpeg`;

            try {
              await sharp(img.buffer)
                .resize(
                  req.body[img.fieldname + "Width"],
                  req.body[img.fieldname + "Height"]
                )
                .toFormat("jpeg")
                .jpeg({ quality: 90 })
                .toFile(`${path.join(__dirname, "../../public/photos" + filename)}`);

              req.body.arrayImages.push(filename);
            } catch (err) {
              throw err;
            }
          })
        );
      }

      next();
    } catch (err) {
      res.status(400).send({ error: err.name });
    }
  };
};

//pdf

exports.formatResumePDF = async (req, res, next) => {
  if (!req.file) return next();

  req.body.pdf = `/resume/course-pdf-${
    req.file.originalname
  }-${Date.now()}.pdf`;

  try {
    await sharp(req.file.buffer)
      // .resize(req.body.width, req.body.height)
      .toFormat("pdf")
      // .jpeg({ quality: 90 })
      .toFile(`${path.join(__dirname, "../../public/pdf" + req.body.pdf)}`);

    next();
  } catch (err) {
    res.status(400).send({ error: err.name });
  }
};
