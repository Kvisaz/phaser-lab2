// style.md

Я пишу компоненты для игр на Phaser 3.80 на TypeScript в таком стиле

```typescript
interface IProps {
  scene: Phaser.Scene;
  text: string;
}

export class TestButton extends Phaser.GameObjects.Container {
  constructor({ scene, text }: IProps) {
    super(scene);
    const textObject = scene.add.text(0, 0, text, { fontSize: "32px", color: "#dedede" });

    this.add([textObject]);
    scene.add.existing(this as Phaser.GameObjects.Container);
  }
}
```

мой tsconfig выглядит так

{
"compilerOptions": {
"target": "es5",
"lib": ["dom", "dom.iterable", "esnext"],
"allowJs": true,
"skipLibCheck": true,
"esModuleInterop": true,
"allowSyntheticDefaultImports": true,
"strict": true,
"forceConsistentCasingInFileNames": true,
"noFallthroughCasesInSwitch": true,
"module": "esnext",
"moduleResolution": "node",
"resolveJsonModule": true,
"isolatedModules": true,
"jsx": "react",
"outDir": "dist",
"baseUrl": "src",
"downlevelIteration": true,
"types": ["phaser", "@types/jest", "@types/node"]
},
"include": ["src", "typings.d.ts"]
}


мой package.json выглядит так

{
"name": "phaser-lab2",
"version": "1.0.0",
"main": "index.js",
"scripts": {
"start": "webpack serve --mode development",
"build": "webpack --mode production",
"typecheck": "tsc --noEmit",
"storybook": "webpack serve --mode development --config webpack.storybook.js",
"build-storybook": "webpack --mode production --config webpack.storybook.js",
"predeploy": "npm run build-storybook",
"deploy": "git add docs && git commit -m \"Deploy docs to GitHub Pages\" && git push"
},
"keywords": [],
"author": "",
"license": "ISC",
"description": "Phaser Games components",
"devDependencies": {
"@types/jest": "^29.5.12",
"@types/node": "^22.1.0",
"@typescript-eslint/eslint-plugin": "^8.0.1",
"@typescript-eslint/parser": "^8.0.1",
"copy-webpack-plugin": "^12.0.2",
"esbuild-loader": "^4.2.2",
"eslint": "8.57.0",
"html-webpack-plugin": "^5.6.0",
"jest": "^29.7.0",
"phaser": "^3.80.1",
"prettier": "^3.3.3",
"ts-jest": "^29.2.4",
"typescript": "4.5.5",
"webfontloader": "^1.6.28",
"webpack": "^5.93.0",
"webpack-cli": "^5.1.4",
"webpack-dev-server": "^5.0.4"
}
}