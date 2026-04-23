
let cards = document.querySelector('.cards');

let pics = ['Header_1.jpg', 'images.jpg',"images (1).jpg"];
let texts = [
  'Стим 2.0: Новая эра цифровой дистрибуции\n' +
    '\n' +
    'Представьте себе платформу, которая больше не просто магазин игр. Steam 2.0 — это экосистема, где стираются грани между лаунчером, сообществом и операционной системой.\n' +
    '\n' +
    'Исчезли устаревшие «библиотеки» и «витрины». На смену им пришли живые пространства: DUNGEON AWAKENING (пробуждение подземелья) для хардкорных РПГ, LOADS OF MAYHEM для бесконечного хаоса в мультиплеере и WOLFEN для тактических шутеров.\n' +
    '\n' +
    'Но главное — это «Под капотом». Steam 2.0 впитывает лучшее от Flatbub: моментальные обновления, песочную безопасность и унифицированные рантаймы. Больше никаких зависимостей и «библиотек Visual C++». Установил YERO BROODS — и она сразу запустилась. Захочешь удалить — система не оставит после себя цифрового мусора.\n' +
    '\n' +
    'Доступно сейчас (AVAILABLE NOW). Будущее, которое не надо ждать.',
  'untitled',
];

for (let i = 0; i < pics.length; i += 1) {
  let img = document.createElement('img');
  img.src = pics[i];

  let text = document.createElement('p');
  img.className = 'text';
  text.innerHTML = texts[i];

  let card = document.createElement('div');
  card.className = 'card';

  card.appendChild(img);
  card.appendChild(text);

  cards.appendChild(card);
}