const objectId = (value, helpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message('"{{#label}}" must be a valid mongo id');
  }
  return value;
};

const password = (value, helpers) => {
  if (value.length < 8) {
    return helpers.message('password must be at least 8 characters');
  }
  if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
    return helpers.message('password must contain at least 1 letter and 1 number');
  }
  return value;
};

const httpUrl = (string, helpers) => {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return helpers.message('Not a valid url');
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return helpers.message('Not a valid url');
    // throw new Error(`'Not a valid url`);
  }
  return string;
};

module.exports = {
  objectId,
  password,
  httpUrl,
};
