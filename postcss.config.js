module.exports = {
  plugins: [
    require('precss'),
    require('autoprefixer'),
    require('postcss-px2rem')({ remUnit: 14 }),
    require('cssnano')({ safe: true })
  ]
};