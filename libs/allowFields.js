//Permet de gerer les differents champs autoriser par l'user

const filterObj = (obj, allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((key) => {
    if (allowedFields.includes(key)) {
      newObj[key] = obj[key];
    }
  });
  return newObj;
};

const allowedFields = (data, fields) => {
  const filteredBody = filterObj(data, fields);
  Object.assign(data, filteredBody);
  console.log(filteredBody);
  return data;
};

module.exports = allowedFields;
