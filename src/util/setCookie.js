const cookieSetter = (token, access, res) => {
  let maxAge = access ? 60 * 60 * 24 * 1000 : 0;

  res.cookie('jWt', token, {
    maxAge,
    secure: true,
    httpOnly: true,
    sameSite: 'None',
  });
};

module.exports = cookieSetter;
