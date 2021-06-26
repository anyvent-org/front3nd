const config = require('../lib/config/webpack');

module.exports = config({
  base: __dirname,
  displayName: 'front3nd Test',
  logo: '/static/img/logo.png',
  bundleName: 'front3nd-test',
  svgSprites: [
    {
      source: '/icons/**/*.svg',
      out: 'static/sprite.svg',
    }
  ],
  templates: {
    out: '../dist/templates'
  },
  static: {
    out: '../dist/static'
  }
});