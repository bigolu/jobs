function squareRoot(n) {
  let start = 0;
  let end = Math.ceil(n / 2);
  let firstGreaterThan = -1;
  while (end >= start) {
    const mid = start + Math.floor((end - start) / 2);
    const squared = mid ** 2;
    if (squared == n) {
      return mid;
    } else if (squared < n) {
      start = mid + 1;
    } else {
      firstGreaterThan = mid;
      end = mid - 1;
    }
  }

  if (firstGreaterThan == -1) {
    return firstGreaterThan;
  } else {
    return firstGreaterThan - 1;
  }
}

function* main() {
  const n = parseInt(yield);
  const res = squareRoot(n);
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
