const errorMap = {
  'Unauthorized request': '. The supplied login token is no longer valid.',
  'No Vox!': `=Can't find vox nearby.`,
};

function expandError(message: string) {
  const extra = errorMap[message];
  if (extra) {
    switch (extra[0]) {
      case '=': return extra.substr(1);
      default:
        return message + ' ' + extra;
    }
  }
  return message;
}

export {
  errorMap,
  expandError,
};
