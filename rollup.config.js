import { terser } from "rollup-plugin-terser";
import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
import del from "rollup-plugin-delete";
import copy from "rollup-plugin-copy";

export default {
  input: "src/index.js",

  output: {
    dir: "dist",
    format: "umd",
    name: "niba",
    sourcemap: true,
    plugins: [terser()],
  },

  plugins: [
    del({ targets: "dist/*" }),
    nodeResolve(),
    commonjs(),
    babel({ babelHelpers: "runtime" }),
    copy({
      targets: [
        {
          src: "package.json",
          dest: "dist/package.json",
        },
      ],
    }),
  ],

  external: ["lodash", /@babel\/runtime/],
};
