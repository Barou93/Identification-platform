/** @format */

// const createCookie = (res, token, name) => {
//   //Define cookies options
//   let expiresIn;
//   if (name === 'accessToken') {
//     expiresIn = process.env.JWT_EXPIRES_IN * 24 * 60 * 60 * 1000;
//   }
//   const cookieOption = {
//     httpOnly: true,
//     expires: new Date(Date.now() + expiresIn),
//     sameSite: 'strict',
//   };
//   if (process.env.NODE_ENV === 'production') cookieOption.secure = true;
//   return res.cookie(name, token, cookieOption);
// };
const createCookie = (res, token, name) => {
  const expiresIn = process.env.JWT_EXPIRES_IN * 1000;

  const cookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now() + expiresIn),
    sameSite: 'strict',
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie(name, token, cookieOptions);
};

module.exports = createCookie;
