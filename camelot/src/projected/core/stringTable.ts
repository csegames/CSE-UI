let stringTable: Record<string, string> = {};

export function loadStringTable(version: number, content: string): Record<string, string> {
  if (version != 1) {
    console.error(`Invalid StringTable version ${version}`);
    return;
  }
  const parsed = JSON.parse(content);
  if (!parsed || !Array.isArray(parsed.defs)) {
    console.error(`Invalid StringTable data - expected an array of defs`);
    return;
  }
  const result: Record<string, string> = {};
  parsed.defs.forEach((e: any) => (result[e.id ?? ''] = e.text ?? ''));
  stringTable = result;
}

export function lookupString(tag: string): string {
  return stringTable[tag] ?? tag;
}
