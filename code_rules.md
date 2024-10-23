# Как писать код 

Пишем код в расчете на  Phaser 3.80 и TypeScript 4.5.5 - это наш стабильный сетап.

## Опциональные функции или коллбэки в TypeScript
Если какая-то функция может быть undefined/null - используем синтаксис ?.
```typescript
myOptionalCallback?.();
```

## Аргументы как  props объекты
Если функция или конструктор требует больше двух полей - используем как аргумент props - то есть объект с нужными именованными полями.  

Это позволяет легко вспоминать их при наборе, а также использовать готовые аргументы.
В имени интерфейса  всегда указываем Props в конце. Если props не деструктуризируется сразу, делаем его private в классах.

```typescript
interface IMyFuncProps {
  scene: Phaser.Scene;
  text: string;
  x: number;
  y: number;
}

function MyFunc ({ scene, text, y, x }: IMyFuncProps) {
  // используем аргументы
}
```

## Компоненты
Все визуальные игровые элементы стараемся писать как компоненты. Компонент -  всегда Phaser.GameObjects.GameObject. Для сложных компонентов используем Container.

Аргумент конструктора - всегда объект props с полями, даже если там используется один аргумент scene, для единообразия.

props в компоненте всегда объявляется как приватный элемент - для удобного и компактного доступа к его свойствам во всех методах.

```typescript
interface IProps {
  scene: Phaser.Scene;
  //... other fields
  text: string;
}

export class MyComponent extends Phaser.GameObjects.Container {
  constructor(private props: IProps) {
    super(props.scene);
    const { scene, text } = props;
  }
  
  someMethod(){
    const { scene, text } = this.props; // деструктуризируем только необходимые поля
    //   операции с scene, text
  }
}
```

## Игра как компонент
Даже игры делаются как компонент - внутри одной сцены. Это позволяет легко собирать игры в сборники, а также тестировать их в разных условиях.

Примером игры-компонента является файл src/games/MineSweeperGame/MineSweeperGame.ts. 

## Загрузка и создание картинок
Для загрузки и создания картинок используются константные объекты SomeGameNameAssets с обязательным полем 
```async load(scene: Phaser.Scene): Promise<void> // загрузка всех необходимых ресурсов```

Остальные поля в таких объектах - именнованные синхронные функции с аргументом `scene: Phaser.Scene`, которые возвращают готовые объекты типа Phaser.GameObjects.Image, Phaser.GameObjects.Sprite и так далее.

Рассчитывай на такой синтаксис, обычно эти файлы готовятся вместе с дизайном и находятся в той же папке, что и компонент, ассеты которого они обслуживают.

## Размеры и координаты в Phaser 3.80
Оптимальный и рекомендуемый способ - использовать getBounds для вычисления реальных видимых размеров и координат.

1. Это позволяет работать с контейнерами, у которых нет width/displayWidth и прочих свойств
2. Это позволяет корректно вычислять координаты top, left, centerX, centerY независимо от origin
```typescript
const container = new Phaser.GameObjects.Container(scene, 0, 0, []);
// разумеется мы используем только те поля, которые нужны в логике
const { width, height, top, left, centerX, centerY } = container.getBounds();
```

## класс Align для позиционирования объектов относительно друг друга и на сцене
Для позиционирования объектов относительно друг друга или на сцене используем мой утилитный класс Align, который импортируется из '@kvisaz/phaser-sugar'. Его базовая концепция - anchor - объект или сцена, относительно которого происходит позиционирование. 

anchor никогда не двигается в момент операции, двигаются все остальные

```typescript
import { Align } from "@kvisaz/phaser-sugar";

let scene: Phaser.Scene;
let obj1: Phaser.GameObjects.GameObject;
let obj2: Phaser.GameObjects.GameObject;
let obj3: Phaser.GameObjects.GameObject;

// создаем класс, если анкор заранее не известен
const align = new Align();

// создаем класс, если анкор известен
const align = new Align(obj);

// центрируем объект obj2 по obj1, который не двигается
align.anchor(obj1).center(obj2);
// другие методы центрирования
align.anchor(obj1).centerX(obj2); 
align.anchor(obj1).centerY(obj2); 

// все методы Align возвращают ссылку на него, что позволяет использовать цепочечный синтаксис
align.anchor(obj1).centerY(obj2) // тут выравниваем obj2 по obj1
  .anchor(obj2).leftTo(obj3).centerX(obj3) // а тут по выравненному obj2 - позиционируем obj3


// короткий синтаксис - не сохраняем align в переменную, если не нужно переиспользование
new Align(obj1).centerY(obj2) 
  .anchor(obj2).leftTo(obj3).centerX(obj3)
```

Методы Align:
- anchor(item: ISizeable): this - анкор на объект
- anchorSceneScreen(scene: Phaser.Scene): this - анкор на сцену
- center(item: AlignObject, oX = 0, oY = 0): this - выравнивание по всем осям со смещением, смещение всегда слева направо и сверху вниз
- centerX(item: AlignObject, oX = 0): this
- centerY(item: AlignObject, oY = 0): this
- bottomIn(item: AlignObject, oY = 0): this - нижняя граница объекта должна совпасть с нижней границей анкора
- topIn(item: AlignObject, oY = 0): this - верхняя граница объекта должна совпасть с верхней границей анкора
- leftIn(item: AlignObject, oY = 0): this - аналогично для левых границ
- rightIn(item: AlignObject, oY = 0): this - аналогично для правых границ
- bottomTo(item: AlignObject, oY = 0): this - объект снизу, верхняя граница объекта должна совпасть с нижней границей анкора
- topIn(item: AlignObject, oY = 0): this - объект сверху, нижняя граница объекта должна совпасть с верхней границей анкора
- leftIn(item: AlignObject, oY = 0): this - объект слева, правая граница объекта должна совпасть с левой границей анкора
- rightIn(item: AlignObject, oY = 0): this - объект справа, левая граница объекта должна совпасть с правой границей анкора

Параметр oX, oY - это смещение по соответствующей оси, всегда отсчитывается слева направо или сверху вниз. Параметры опциональны и по умолчанию равны 0.
