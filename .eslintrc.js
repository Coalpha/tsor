module.exports = {
    extends: "airbnb-base",
    plugins: [
      "json",
    ],
    rules: {
      'no-plusplus': 'off',
      'no-bitwise': 'off',
    },
    globals: {
      d3: true,
    },
};
