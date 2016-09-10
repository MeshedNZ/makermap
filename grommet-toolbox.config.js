import path from 'path';

export default {
  copyAssets: [
    'src/index.html',
    {
      asset: 'src/img/**',
      dist: 'dist/img/'
    }
  ],
  jsAssets: ['src/js/**/*.js'],
  mainJs: 'src/js/index.js',
  mainScss: 'src/scss/index.scss',
  webpack: {
    module: {
      loaders: [{
        test: /\.js$/,
        include: path.resolve('node_modules/mapbox-gl-shaders/index.js'),
        loader: 'transform/cacheable?brfs'
      }],
      postLoaders: [{
        include: /node_modules\/mapbox-gl-shaders/,
        loader: 'transform',
        query: 'brfs'
      }]
    },
    resolve: {
      alias: {
          'webworkify': 'webworkify-webpack'
      }
    },
    devtool: 'cheap-source-map'
  },
  devServerPort: 9000,
  eslintOverride: path.resolve(__dirname, 'customEslintrc'),
  scsslint: true
};
