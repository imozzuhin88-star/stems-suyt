
let cards = document.querySelector('.cards');

let pics = ['Header_1.jpg', 'images.jpg',"images (1).jpg"];
let texts = ['untitled', 'untitled'];

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