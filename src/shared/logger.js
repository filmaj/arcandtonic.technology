module.exports = function (route) {
  return function (msg) {
    // eslint-disable-next-line
    console.log(route, msg);
  };
};
