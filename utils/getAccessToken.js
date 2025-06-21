// utils/getAccessToken.js

const getAccessToken = (req) => {
  // For debugging, log session (optional, remove in production)
  console.log("SESSION DEBUG:", req.session);
  return req.session?.passport?.user?.accessToken;
};

module.exports = getAccessToken;
