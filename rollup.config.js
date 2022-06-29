import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import typescript from "rollup-plugin-typescript2";
import cleanup from 'rollup-plugin-cleanup'

export default {
    input: "src/index.ts", // 打包入口
    output: [
        {
            file: "lib/index.js",
            name: "GuideProcess",
            format: "umd"
        },
    ],
    plugins: [
        typescript(),
        resolve(),
        commonjs(),
        cleanup()
    ],
    external: ["@popperjs/core", "@tweenjs/tween.js"]
};
