const Role = require("../model/roleRoute/role");
const Route = require("../model/roleRoute/routes");
const AppError = require("../appError/appError");

const Authorize = async (req, res, next) => {
  const userRole = await Role.findByPk(req.user.frkRole);

  if (!userRole) return next(new AppError("UNKNOWN ROLE", 404));

  let path = req.path.replace(/\d+$/, ":id");

  const accessibleRoutes = await Route.findOne({
    where: {
      path: path,
    },
    include: {
      model: Role,
      through: {
        attributes: [],
      },
    },
  });

  if (!accessibleRoutes) return next(new AppError("ROUTE IS NOT DEFIEND", 404));

  const accessibleRoutesJ = JSON.stringify(accessibleRoutes);

  const accessibleRoutesP = JSON.parse(accessibleRoutesJ);

  const roleJ = JSON.stringify(userRole);
  const roleP = JSON.parse(roleJ);

  const isUserAllowed = accessibleRoutesP.Roles.some(
    (itm) => itm.id === roleP.id
  );

  if (!isUserAllowed) return next(new AppError("ACCESS DENIED", 403));

  req.userRole = userRole;

  next();
};

// const restrictTo = (...roles) => {
//   return (req, res, next) => {
//     if (!roles.includes(req.user.role)) {
//       return res.status(403).send({ error: "access denied" });
//     }

//     next();
//   };
// };

// module.exports = restrictTo;

// restricTo('admin','author')

module.exports = Authorize;
