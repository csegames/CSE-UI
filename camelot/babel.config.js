module.exports = {
  retainLines: true,
  presets: [
    '@babel/preset-react',
    [
      '@babel/preset-env',
      {
        targets: {
          chrome: '49'
        }
      }
    ]
  ]
};
