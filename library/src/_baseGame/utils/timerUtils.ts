export class TimerRef {
  run: boolean = true;
}

// timerDuration in milliseconds
export function startTimer(
  timerDurationInMs: number,
  intervalInMs: number,
  onUpdate: (elapsedMs: number, timeLeftInMs: number) => void
) {
  const startTime = Date.now();
  var timerRef = new TimerRef();
  timerTick(timerRef, startTime, intervalInMs, timerDurationInMs, onUpdate);
  return timerRef;
}

export function endTimer(timerRef: TimerRef) {
  timerRef.run = false;
}

function timerTick(
  timerRef: TimerRef,
  startTime: number,
  intervalInMs: number,
  timerDurationInMs: number,
  onUpdate: (elapsedMs: number, timeLeftInMs: number) => void
) {
  if (!timerRef.run) {
    return;
  }

  const elapsed = Date.now() - startTime;
  const amountLeft = timerDurationInMs - elapsed;

  onUpdate(elapsed, amountLeft);

  if (amountLeft <= 0) {
    return;
  }

  // Set state to how much time is left (we can math round here or something so that it's not an ugly number)
  setTimeout(() => timerTick(timerRef, startTime, intervalInMs, timerDurationInMs, onUpdate), intervalInMs);
}
