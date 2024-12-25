function findBoundary(arr) {
  return helper(arr, 0, arr.length - 1);
}

function helper(arr, start, end) {
  if (end - start < 0) {
    return -1;
  }
  if (end == start) {
    if (arr[start]) {
      return start;
    } else {
      return -1;
    }
  }

  // must use floor or we'll hit an infinite loop if there are 2 left and the second one is true
  const mid = start + Math.floor((end - start) / 2);

  const item = arr[mid];
  if (item) {
    return helper(arr, start, mid);
  } else {
    return helper(arr, mid + 1, end);
  }
}

function splitWords(s) {
  return s == "" ? [] : s.split(" ");
}

function* main() {
  const arr = splitWords(yield).map((v) => v === "true");
  const res = findBoundary(arr);
  console.log(res);
}

class EOFError extends Error {}

const gen = main();
const next = (line) => gen.next(line).done && process.exit();
let buf = "";
next();
process.stdin.setEncoding("utf8");
process.stdin.on("data", (data) => {
  const lines = (buf + data).split("\n");
  buf = lines.pop() ?? "";
  lines.forEach(next);
});
process.stdin.on("end", () => {
  buf && next(buf);
  gen.throw(new EOFError());
});
