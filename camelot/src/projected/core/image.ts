function onImageFailure(
  url: string,
  resolve: (value: HTMLImageElement | PromiseLike<HTMLImageElement>) => void
): OnErrorEventHandlerNonNull {
  return (event: Event | string, source?: string, lineno?: number, colno?: number, error?: Error) => {
    const msg = url.startsWith('data:') ? 'Failed to load embedded image' : `Failed to load image ${url}`;
    console.error(msg, error);
    resolve(null);
  };
}

export function preloadImage(height: number, width: number, url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image(width, height);
    image.onload = () => resolve(image);
    image.onerror = onImageFailure(url, resolve);
    image.onabort = onImageFailure(url, resolve);
    image.src = url;
  });
}
