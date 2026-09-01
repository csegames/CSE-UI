interface TokenGuts {
  ch?: string;
}

export function getCharacterID(accessToken: string): string | undefined {
  const bits: string[] = accessToken.split('.');
  if (bits.length != 3) {
    return null;
  }

  const middle = atob(bits[1]);
  try {
    const parsed: TokenGuts = JSON.parse(middle);
    return parsed.ch;
  } catch (e) {
    console.error('Failed to parse character ID', e);
    return null;
  }
}
