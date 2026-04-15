import * as readline from "readline";

export function readInput(prompt: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

export function readPassword(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    process.stdout.write(prompt);

    const chars: string[] = [];
    const stdin = process.stdin;
    const wasRaw = stdin.isRaw;

    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding("utf8");

    const onData = (ch: string) => {
      const code = ch.charCodeAt(0);

      if (ch === "\r" || ch === "\n") {
        stdin.removeListener("data", onData);
        stdin.setRawMode(wasRaw ?? false);
        stdin.pause();
        process.stdout.write("\n");
        resolve(chars.join(""));
        return;
      }

      if (code === 3) {
        // Ctrl+C
        process.exit(1);
      }

      if (code === 127 || code === 8) {
        // Backspace / Delete
        if (chars.length > 0) {
          chars.pop();
          process.stdout.write("\b \b");
        }
        return;
      }

      if (code < 32) {
        return;
      }

      chars.push(ch);
      process.stdout.write("*");
    };

    stdin.on("data", onData);
  });
}
