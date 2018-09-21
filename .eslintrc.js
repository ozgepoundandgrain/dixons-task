module.exports = {
  extends: '@dc/eslint-config/es6',
  rules: {
    'max-len': 0,
    'no-console': 0,
    'global-require': 0,
    'no-underscore-dangle': 0
  },
  globals: {
    window: true,
    document: true,
    $: true,
    test: true,
    expect: true,
    require: true
  }
};
