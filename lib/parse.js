const Matchers = {
  key: /(\w+):/,
  value: /:("(.*)"|((\w|-)+))/,
  pairs: /(\w+:(".*"|(\w|-)+))*/g,
  status: /^(ok|error|hello)/,
  body: /^(ok|error|hello) (.*)/
  // pairs: /(\w+):("(.*)"|((\w|-)+))/g
};

const status = message => {
  const matches = Matchers.status.exec(message);

  if (matches) {
    return matches[1];
  }
};

const body = message => {
  const matches = Matchers.body.exec(message);

  if (matches && matches.length === 3) {
    return matches[2];
  }

  return "";
};

const pairs = body => {
  return Array.from(body)
    .reduce(
      (output, char, index) => {
        const current = output[output.length - 1];

        if (char === '"' && !output.inString) {
          output.inString = true;
        } else if (char === '"' && output.inString) {
          output.inString = false;
        } else if (char === ":" && !output.inString) {
          output.push([]);
        } else if (char === " " && !output.inString) {
          output.push([]);
        } else {
          output[output.length - 1] += char;
        }

        return output;
      },
      [[]]
    )
    .reduce((output, item, index, array) => {
      const isValue = index % 2 === 1;

      if (isValue) {
        const key = array[index - 1];
        output[key] = item;
      }

      return output;
    }, {});
};

const parse = message => {
  return {
    STATUS: status(message),
    ...pairs(body(message))
  };
};

module.exports = parse;

module.exports.body = body;
module.exports.status = status;
module.exports.pairs = pairs;

// module.exports.key = pair => {
//   const matches = Matchers.key.exec(pair);
//   return matches ? matches[1] : "";
// };

// module.exports.value = pair => {
//   const matches = Matchers.value.exec(pair);

//   if (matches && matches[2]) {
//     return matches[2];
//   } else if (matches && matches[1]) {
//     return matches[1];
//   }

//   return "";
// };

// module.exports.object = body => {
//   console.log(Matchers.pairs.exec(body));
// };
