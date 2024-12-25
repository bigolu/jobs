function findFirstOccurrence(arr, target) {
  if (arr.length == 0) {
    return -1;
  }

  let start = 0;
  let end = arr.length;
  let firstMatch = -1;
  while (end >= start) {
    const mid = start + Math.floor((end - start) / 2);
    if (arr[mid] < target) {
      start = mid + 1;
    } else {
      firstMatch = mid;
      end = mid - 1;
    }
  }

  if (arr[firstMatch] == target) {
    return firstMatch;
  } else {
    return -1;
  }
}

function splitWords(s) {
  return s == "" ? [] : s.split(" ");
}

function* main() {
  const arr = splitWords(yield).map((v) => parseInt(v));
  const target = parseInt(yield);
  const res = findFirstOccurrence(arr, target);
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
