#Промпты 2024 09 01
- [Ссылка на чат](https://chatgpt.com/share/66e981c7-4294-800c-85e2-b3e28b9e5d47)

## Промпт 1 - кодирование по стилю и правилам 

Я пишу компоненты для игр на Phaser 3.80  на TypeScript в таком стиле

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


Помоги мне создать простой настраиваемый компонент для игры Сапер
Это должна быть полноценная игра, но без интерфейса, просто игровое поле

Ожидаемые параметры в IProps:
cellSize: number;
columns: number;
rows: number;
minesAmount: number;

ты можешь расширить IProps коллбэками для передачи необходимой информации, которая будет отображаться в UI

ты можешь рассчитывать на то, что я предоставлю игре необходимые ссылки на url картинок и эти ассеты будут загружены заранее, можешь обращаться как к полям глобального объекта AssetImages, где название поля будет отражать суть графического ассета, а значение будет в формате { texturename: string; frame?: string }


## Промпт 2 - загрузка графики

Я подготовил файл PNG с прозрачностью в котором все спрайты
- размер каждого спрайта 128x128 пикселов
- расстояние между спрайтами - 0, они вплотную
- первый горизонтальный ряд: cell, revealedCell, flag, mine

Файл находится по относительному пути к урл игры в папке './assets/atlases/minesweeper01.png'


Я подготовил также тестовый файл для своего самодельного сторибука

import { IStory } from "../../../storybook/interfaces";
import { Minesweeper } from "./Minesweeper";

export const minesweeperStory: IStory = {
title: "Minesweeper",
run: async (scene) => {
const container = new Minesweeper({
scene,
cellSize: 32,
columns: 10,
rows: 10,
minesAmount: 15,
onCellReveal: cell => {
console.log('onCellReveal', cell)
},
onGameOver: isWin => {
console.log('onGameOver', isWin)
}
});
scene.add.existing(container);

        return ()=>{
            container.destroy();
        }
    }
};


также я подготовил файл AssetImages.ts, который успешно импортируется в твой код
но он пока не рабочий
export const AssetImages = {
flag: {
textureName: '',
frameName: undefined
},
revealedCell: {
textureName: '',
frameName: undefined
},
mine: {
textureName: '',
frameName: undefined
},
cell: {
textureName: '',
frameName: undefined
}
}

textureName - соответственные изменения в регистре сделаны и в коде

Что нужно сделать

1. создать асинхронную функцию, которая загружает любой файл PNG как атлас - мы положим ее в отдельный файл

2. написать строчку которая должна войти в run для вызова этой функции с корректным урлом на './assets/atlases/minesweeper01.png'

3. заполнить поля AssetImages корректными значениями

4. указать какие изменения надо сделать, чтобы заработал frameName


## Промпт 3 

Можешь доработать loadAtlasFromPNG так, чтобы он мог обрабатывать спрайты расположенные не только в первом ряду?

вот текущий код, я типизировал frames так как TypeScript ругался
... код

## Промпт 4

Загрузилось, запустилось, появляются цифры
но в консоли ошибка
Texture "minesweeper" has no frame "cell"

вот коды файлов

... код

## Промпт 5

Мне кажется, что происходит некоторая ошибка - нам не нужно грузить атлас
мы можем просто загрузить картинку как картинку
И уже ее распилить на фреймы

попробуй упростить loadAtlasFromPNG таким образом 


## Промпт 6

Теперь все заработало!

Но есть небольшая проблема - правая кнопка в браузере не работает, точнее она занята контекстным меню браузера
Что можно предложить как однокнопочный вариант флага для онлайн-игры в браузере?

...
Предложил хорошие варианты
- длинное нажатие (я реализовал)
- по кнопке