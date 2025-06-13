const carousel = document.querySelector('.carousel-imgs');
const imagens = document.querySelectorAll('.carousel-imgs img');
let indexAtual = 0;
const total = imagens.length;
const degStep = 360 / total;

// Posiciona imagens ao redor de um círculo
imagens.forEach((img, i) => {
  const angulo = i * degStep;
  img.style.transform = `rotateY(${angulo}deg) translateZ(400px)`;
});

// Atualiza a imagem visível
function atualizarCarrossel() {
  const anguloAtual = -indexAtual * degStep;
  carousel.style.transform = `rotateY(${anguloAtual}deg)`;

  imagens.forEach((img, i) => {
    img.classList.toggle('active', i === indexAtual);
  });
}

// Navegação por toque
let startX = 0;
let isDragging = false;

carousel.addEventListener('touchstart', (e) => {
  startX = e.touches[0].clientX;
  isDragging = true;
});

carousel.addEventListener('touchmove', (e) => {
  if (!isDragging) return;
  const diffX = e.touches[0].clientX - startX;
  if (Math.abs(diffX) > 50) {
    indexAtual = (indexAtual + (diffX < 0 ? 1 : -1) + total) % total;
    atualizarCarrossel();
    isDragging = false;
  }
});

carousel.addEventListener('touchend', () => isDragging = false);

// Navegação por mouse
let mouseStartX = 0;
let mouseDragging = false;

carousel.addEventListener('mousedown', (e) => {
  mouseStartX = e.clientX;
  mouseDragging = true;
});

carousel.addEventListener('mousemove', (e) => {
  if (!mouseDragging) return;
  const diffX = e.clientX - mouseStartX;
  if (Math.abs(diffX) > 50) {
    indexAtual = (indexAtual + (diffX < 0 ? 1 : -1) + total) % total;
    atualizarCarrossel();
    mouseDragging = false;
  }
});

document.addEventListener('mouseup', () => mouseDragging = false);

// Iniciar com a primeira imagem visível
atualizarCarrossel();

// Player de música
const musicas = [
  {
    arquivo: 'musicas/musica 1.mp3',
    imagem: 'imagens/children.jpg'
  },
  {
    arquivo: 'musicas/musica 2.mp3',
    imagem: 'imagens/years.png'
  },
  {
    arquivo: 'musicas/musica 3.mp3',
    imagem: 'imagens/all.jpg'
  }
];

let musicaAtual = 0;
const audio = document.getElementById('audio');
const trackName = document.getElementById('trackName');
const playPauseBtn = document.getElementById('playPauseBtn');
const nextTrack = document.getElementById('nextTrack');
const prevTrack = document.getElementById('prevTrack');
const player = document.getElementById('player');

let tocando = false;

playPauseBtn.addEventListener('click', () => {
  if (tocando) {
    audio.pause();
    playPauseBtn.textContent = '>';
  } else {
    audio.play();
    playPauseBtn.textContent = '||';
  }
  tocando = !tocando;
});

nextTrack.addEventListener('click', () => {
  musicaAtual = (musicaAtual + 1) % musicas.length;
  carregarMusica(musicaAtual);
  audio.play();
  playPauseBtn.textContent = '||';
  tocando = true;
});

prevTrack.addEventListener('click', () => {
  musicaAtual = (musicaAtual - 1 + musicas.length) % musicas.length;
  carregarMusica(musicaAtual);
  audio.play();
  playPauseBtn.textContent = '>';
  tocando = true;
});

function carregarMusica(index) {
  const musica = musicas[index];
  const player = document.getElementById('player');

  audio.src = musica.arquivo;
  trackName.textContent = musica.nome;

  player.style.backgroundImage =
    `radial-gradient(circle, rgba(0, 0, 0, 0.3) 0%, rgba(0, 0, 0, 0.8) 90%), url('${musica.imagem}')`;
  player.style.backgroundSize = 'cover';
  player.style.backgroundPosition = 'top';
  player.style.backgroundRepeat = 'no-repeat';
  player.style.borderRadius = '20px';
  player.style.overflow = 'hidden';  
}

carregarMusica(musicaAtual);

// Tenta tocar automaticamente
document.addEventListener('DOMContentLoaded', () => {
  const tentativaPlay = audio.play();

  if (tentativaPlay !== undefined) {
    tentativaPlay
      .then(() => {
        playPauseBtn.textContent = '||';
        tocando = true;
      })
      .catch((error) => {
        // Autoplay falhou – geralmente o navegador bloqueou
        console.log('Autoplay bloqueado pelo navegador:', error);
        playPauseBtn.textContent = '▶';
        tocando = false;
      });
  }
});


const barraProgresso = document.getElementById('barraProgresso');
const progresso = document.getElementById('progresso');
const tempoAtual = document.getElementById('tempoAtual');
const duracaoTotal = document.getElementById('duracaoTotal');

audio.addEventListener('timeupdate', () => {
  const { currentTime, duration } = audio;
  if (!isNaN(duration)) {
    const percent = (currentTime / duration) * 100;
    progresso.style.width = `${percent}%`;
    tempoAtual.textContent = formatarTempo(currentTime);
    duracaoTotal.textContent = formatarTempo(duration);
  }
});

barraProgresso.addEventListener('click', (e) => {
  const largura = barraProgresso.clientWidth;
  const cliqueX = e.offsetX;
  const duracao = audio.duration;
  audio.currentTime = (cliqueX / largura) * duracao;
});

function formatarTempo(segundos) {
  const min = Math.floor(segundos / 60);
  const seg = Math.floor(segundos % 60).toString().padStart(2, '0');
  return `${min}:${seg}`;
}

function atualizarTempoJuntos() {
  const inicio = new Date(2021, 10, 20, 0, 0, 0); // 20 nov 2021
  const agora = new Date();

  let anos = agora.getFullYear() - inicio.getFullYear();
  let meses = agora.getMonth() - inicio.getMonth();
  let dias = agora.getDate() - inicio.getDate();
  let horas = agora.getHours() - inicio.getHours();
  let minutos = agora.getMinutes() - inicio.getMinutes();
  let segundos = agora.getSeconds() - inicio.getSeconds();

  if (segundos < 0) {
    segundos += 60;
    minutos--;
  }
  if (minutos < 0) {
    minutos += 60;
    horas--;
  }
  if (horas < 0) {
    horas += 24;
    dias--;
  }
  if (dias < 0) {
    const ultimoMes = new Date(agora.getFullYear(), agora.getMonth(), 0).getDate();
    dias += ultimoMes;
    meses--;
  }
  if (meses < 0) {
    meses += 12;
    anos--;
  }

  document.getElementById('anos').textContent = String(anos).padStart(2, '0');
  document.getElementById('meses').textContent = String(meses).padStart(2, '0');
  document.getElementById('dias').textContent = String(dias).padStart(2, '0');
  document.getElementById('horas').textContent = String(horas).padStart(2, '0');
  document.getElementById('minutos').textContent = String(minutos).padStart(2, '0');
  document.getElementById('segundos').textContent = String(segundos).padStart(2, '0');
}

setInterval(atualizarTempoJuntos, 1000);
atualizarTempoJuntos();

// Corações flutuando em background
function criarCoracao() {
  const container = document.querySelector('.hearts-container');
  if (!container) return;

  const coracao = document.createElement('div');
  coracao.classList.add('coracao');
  coracao.style.left = `${Math.random() * 100}%`;
  coracao.style.animationDuration = `${3 + Math.random() * 2}s`;
  coracao.style.opacity = Math.random().toFixed(2);

  container.appendChild(coracao);

  setTimeout(() => {
    coracao.remove();
  }, 5000);
}

setInterval(criarCoracao, 300);
