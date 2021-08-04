const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = {
	mode: "production",
	entry: "./src/index.js",
	module: {
		rules: [
			{
				test: /\.css$/i,
				use: [MiniCssExtractPlugin.loader, "css-loader"],
				// use: ["style-loader", "css-loader"],
			},
			{
				test: /\.html$/,
				loader: "html-loader",
				options: {
					minimize: true,
				},
			},
			{
				test: /\.(js)$/,
				exclude: /node_modules/,
				use: "babel-loader",
			},
			{
				test: /\.(png|svg|jpg|jpeg|gif)$/i,
				type: "asset/resource",
			},
		],
	},
	optimization: {
		minimizer: [`...`, new CssMinimizerPlugin()],
	},
	output: {
		filename: "main.js",
		path: path.resolve(__dirname, "dist"),
		clean: true,
	},
	plugins: [
		new HtmlWebpackPlugin({
			hash: true,
			template: "public/index.html",
			filename: "./index.html",
		}),
		new MiniCssExtractPlugin({
			filename: "[name].css",
			chunkFilename: "[id].css",
		}),
	],
};
