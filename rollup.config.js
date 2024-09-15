import typescript from "rollup-plugin-typescript2";
import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";

const plugins = [
    typescript({
        tsconfig: "tsconfig.json",
        useTsconfigDeclarationDir: true,
    }),
    resolve(),
    terser(),
]

export default {
    plugins: plugins,
    input: "src/index.ts",
    output: [
        { file: "dist/index.esm.js", format: "esm", name: "TouchRipple", sourcemap: true },
        { file: "dist/index.umd.js", format: "umd", name: "TouchRipple", sourcemap: true },
    ],
}