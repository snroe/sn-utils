import { randArray } from "../../lib/index.js"

const randArrayTest = () => {
  const array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const rand = randArray(array);
  console.log(rand);
};

randArrayTest();