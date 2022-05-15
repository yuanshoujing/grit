import { terser } from "rollup-plugin-terser";
import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";

export default {
  input: "src/index.js",

  output: {
    dir: "dist",
    format: "umd",
    name: "grit",
    sourcemap: true,
    plugins: [terser()],
  },

  plugins: [nodeResolve(), commonjs(), babel({ babelHelpers: "bundled" })],
};
