const { faker } = require('@faker-js/faker');

const arr = [{ id: 1, name: 'a'},{ id: 2, name: 'b'}, { id: 3, name: 'c'}, { id: 4, name: 'd'}];
// const arr = [1,2,3]
const func = () => faker.helpers.arrayElement(arr);
const exclude = arr.filter(el => el.id == 2);

const res = arr.map(_ => faker.unique(func, null, { compare: (obj, key) => {
  const res = !!obj[key] ? 0 : -1;

  // console.log('res', res);
  // console.log('res', res, 'key', key, 'value', obj[key]);
  console.log('obj', obj, key, obj[key]);
  return res;
}}));
console.log(res);

