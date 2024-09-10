const range = (len) => {
  const arr = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
};

const newPerson = () => {
  const statusChance = Math.random();
  return {
    index: '',
    item: '',
    quantity: '',
    amount: ''
  };
};

export function makeData(len) {
  return range(len).map((d) => {
    return {
      ...newPerson()
    };
  });
}
