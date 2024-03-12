// Parse and process dice notation

const singleDiceNotation = (count, sides) => {
  // Return sume of count rolls of a die with sides
  let sum = 0;
  for (let i = 0; i < count; i++) {
    sum += Math.floor(Math.random() * sides) + 1;
  }
  return sum;
};

const allowedNotation = (notation) => {
  // Check if the notation is allowed
  const regex = /^[-+*/()\d\sd]+$/;
  return regex.test(notation);
};

const replaceDice = (s) => {
  // Replace dice notation with the result of the roll
  const regex = /(\d+)?\s*d\s*(\d+)/g;
  return s.replace(regex, (match, count, sides) => {
    count = count === undefined ? 1 : parseInt(count);
    sides = parseInt(sides);
    if (isNaN(count) || isNaN(sides)) {
      return match;
    }
    return singleDiceNotation(count, sides);
  });
};

export const rollDice = (notation) => {
  let n = notation.toLowerCase();
  // Check if the notation is allowed
  if (!allowedNotation(n)) {
    return null;
  }
  // Replace dice notation until not changes
  while (true) {
    const newN = replaceDice(n);
    if (newN === n) break;
    n = newN;
  }
  // Evaluate the result
  const result = new Function(`return (${n})`)();
  if (isNaN(result) || !isFinite(result)) {
    return null;
  }
  return result;
};
