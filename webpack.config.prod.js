const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
      filename: 'index.html',
    }),
    new HtmlWebpackPlugin({
      template: './about.html',
      filename: 'about.html',
    }),
    new HtmlWebpackPlugin({
      template: './projects.html',
      filename: 'projects.html',
    }),
    new HtmlWebpackPlugin({
      template: './skills.html',
      filename: 'skills.html',
    }),
    new HtmlWebpackPlugin({
      template: './graphic-design.html',
      filename: 'graphic-design.html',
    }),
    new HtmlWebpackPlugin({
      template: './contact.html',
      filename: 'contact.html',
    }),
    new CopyPlugin({
      patterns: [
        { from: 'img', to: 'img' },
        { from: 'css', to: 'css' },
        { from: 'js/vendor', to: 'js/vendor' },
        { from: 'js/design-projects.js', to: 'js/design-projects.js' },
        { from: 'icon.svg', to: 'icon.svg' },
        { from: 'favicon.ico', to: 'favicon.ico' },
        { from: 'robots.txt', to: 'robots.txt' },
        { from: 'icon.png', to: 'icon.png' },
        { from: '404.html', to: '404.html' },
        { from: 'site.webmanifest', to: 'site.webmanifest' },
      ],
    }),
  ],
});
