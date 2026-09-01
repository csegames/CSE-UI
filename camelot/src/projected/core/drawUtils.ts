function drawLines(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) {
  ctx.strokeRect(x, y, width - 1, height - 1);
  for (let i = y + 32; i < height + y; i += 32) {
    ctx.beginPath();
    ctx.moveTo(x, i);
    ctx.lineTo(x + width - 1, i);
    ctx.stroke();
  }
  for (let i = x + 32; i < width + x; i += 32) {
    ctx.beginPath();
    ctx.moveTo(i, y);
    ctx.lineTo(i, y + height - 1);
    ctx.stroke();
  }
}

export function drawDebugGrid(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number
): Promise<void> {
  ctx.lineWidth = 7;
  ctx.strokeStyle = '#00000088'; // 50% alpha black
  drawLines(ctx, x, y, width, height); // shadow for contrast
  ctx.lineWidth = 3;
  ctx.strokeStyle = 'white';
  drawLines(ctx, x, y, width, height); // shadow
  return Promise.resolve();
}
// Tuned to make text readable against transparent background in worldspace nameplate UI.
// Looks best for font sizes around 30+/-6
export function fillTextWithDropShadow(ctx: CanvasRenderingContext2D, text: string, x: number, y: number) {
  ctx.save();

  // shadow
  ctx.save();
  const shadowOffset = 2;
  ctx.fillStyle = '#00000088';
  ctx.fillText(text, x + shadowOffset, y + shadowOffset);
  ctx.restore();

  // main text
  ctx.fillText(text, x, y);

  ctx.restore();
}

// Returns an array of lines of text that will fit on the canvas within the margins
// This is not well optimized, so beware of using it for text that frequently is redrawn
// Leading and trailing whitespace are also dropped
// There's probably a better off-the-shelf package out there
export function wrapText(ctx: CanvasRenderingContext2D, text: string, maxLineWidth: number): string[] {
  if (ctx.measureText(text).width < maxLineWidth) {
    return [text];
  }

  let words = text.split(' ');
  let result: string[] = [];
  const spaceWidth = ctx.measureText(' ').width;

  let line = '';
  let lineWidth = 0;
  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const wordWidth = ctx.measureText(word).width;

    if (lineWidth + wordWidth < maxLineWidth) {
      // Word will fit on current line
      line += word + ' ';
      lineWidth += wordWidth + spaceWidth;
    } else if (lineWidth == 0) {
      // Single word bigger than desired max size gets added as its own line
      result.push(word);
    } else {
      // add the current line to result, and start a new line with this word
      result.push(line.trim());
      line = word;
      lineWidth = wordWidth;
    }

    if (i == words.length - 1 && lineWidth != 0) {
      result.push(line);
    }
  }

  return result;
}
