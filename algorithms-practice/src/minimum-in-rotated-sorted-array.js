function findMinRotated(arr) {
  if (arr.length == 0) {
    return -1;
  }

  let minimumIndex = -1;
  let minimumValue = Infinity;
  let startIndex = 0;
  let endIndex = arr.length - 1;
  while (startIndex <= endIndex) {
    const startValue = arr[startIndex];
    const endValue = arr[endIndex];
    const midIndex = startIndex + Math.floor((endIndex - startIndex) / 2);
    const midValue = arr[midIndex];

    if (startValue < minimumValue) {
      minimumValue = startValue;
      minimumIndex = startIndex;
    }
    if (endValue < minimumValue) {
      minimumValue = endValue;
      minimumIndex = endIndex;
    }
    if (midValue < minimumValue) {
      minimumValue = midValue;
      minimumIndex = midIndex;
    }

    if (startValue < endValue) {
      // if start is less than end, we are in a sorted stretch of the list so we won't find a smaller element in between start and end
      break;
    } else {
      if (midValue > startValue) {
        startIndex = midIndex + 1;
      } else {
        if (midValue < endValue) {
          endIndex = midIndex - 1;
        } else {
          startIndex = midIndex + 1;
        }
      }
    }
  }

  return minimumIndex;
}

function splitWords(s) {
  return s == "" ? [] : s.split(" ");
}

function* main() {
  const arr = splitWords(yield).map((v) => parseInt(v));
  const res = findMinRotated(arr);
  console.log(res);
}

class EOFError extends Error {}
{
  const gen = main();
  const next = (line) => gen.next(line).done && process.exit();
  let buf = "";
  next();
  process.stdin.setEncoding("utf8");
  process.stdin.on("data", (data) => {
    const lines = (buf + data).split("\n");
    buf = lines.pop();
    lines.forEach(next);
  });
  process.stdin.on("end", () => {
    buf && next(buf);
    gen.throw(new EOFError());
  });
}
