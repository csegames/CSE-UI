declare interface Process {
  env: Record<string, string>;
}

declare var process: Process;