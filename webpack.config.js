module.exports = {
  output: {
    filename: "[name].pack.js",
  },
  module: {
    rules: [
      {
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "es2015",
              "react",
              "stage-0",
              "babel-preset-env",
              "babel-preset-react",
            ],
          },
        },
        exclude: /node_modules/,
        test: /\.js$/,
      },
    ],
  },
  entry: {
    index: "./index",
  },
};
