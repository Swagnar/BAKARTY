const CANVAS = document.getElementById('main-canvas');
const CTX = CANVAS.getContext('2d');
const ICON_INPUT = document.getElementById('icon-file-input__tag');
const NAME_INPUT = document.getElementById('name-input');
const CONTENT_INPUT = document.getElementById('content-input');
const GENERATE_BUTTON = document.getElementById('generate-button');
const DOWNLOAD_BUTTON = document.getElementById('download-button');

const fontFile = new FontFace(
  "FontFamily Style Vinque",
  "url(Vinque.otf)"
)
fontFile.load().then(function(loadedFont) {
  document.fonts.add(loadedFont);
}).catch(function(error) {
  console.error('Failed to load font:', error);
});


let backgroundImage = new Image();
backgroundImage.crossOrigin = "anonymous";
backgroundImage.src = "bg.png"

let iconImage = new Image(100, 100);
iconImage.crossOrigin = "anonymous";


ICON_INPUT.addEventListener('change', handleIconUpload);
GENERATE_BUTTON.addEventListener('click', generateCard);
DOWNLOAD_BUTTON.addEventListener('click', downloadCard);

window.onload = () => {
  drawBackground();
  drawName("Debugy");
  drawContent("Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae fugiat ad inventore libero eos modi eaque quos accusantium consequatur esse illum tempora eligendi, quo aliquam recusandae. Placeat tempore impedit dolores.");
}

function handleIconUpload(event) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function(e) {
    iconImage.src = e.target.result;
  };

  reader.readAsDataURL(file);
}

function generateCard() {
  const name = NAME_INPUT.value;
  const content = CONTENT_INPUT.value;
  
  CTX.clearRect(0, 0, CANVAS.width, CANVAS.height);
  drawBackground();
  drawIcon();
  drawName(name);
  drawContent(content);
}

function drawBackground() {
  backgroundImage.onload = function() {
    CTX.drawImage(backgroundImage, 0, 0, CANVAS.width, CANVAS.height);
  };
  if (backgroundImage.src) {
    CTX.drawImage(backgroundImage, 0, 0, CANVAS.width, CANVAS.height);
  } else {
    CTX.fillStyle = '#ffffff';
    CTX.fillRect(0, 0, CANVAS.width, CANVAS.height);
  }
  CTX.fillStyle = '#333';
  CTX.fillRect(50, 193, CANVAS.width - 100, 60);
  CTX.fillRect(50, 300, CANVAS.width - 100, 200);
}

function drawIcon() {
  iconImage.onload = function() {
    CTX.drawImage(iconImage, CANVAS.width / 2 - iconImage.width / 2, 70, this.width, this.height);
  };
  if (iconImage.src) {
    CTX.drawImage(iconImage, CANVAS.width / 2 - iconImage.width / 2, 70, this.width, this.height);
  }
}

function drawName(name) {
  CTX.textAlign = 'center';
  CTX.font = '54px FontFamily Style Vinque';
  CTX.strokeStyle = '#473e32';
  CTX.lineWidth = 3;
  CTX.strokeText(name, CANVAS.width / 2, 240);
  CTX.fillStyle = '#7d6c4e'
  CTX.fillText(name, CANVAS.width / 2, 240);
}

function drawContent(content) {
  CTX.font = '16px "FontFamily Style Vinque"';
  CTX.fillStyle = '#bfaf8f'
  CTX.textAlign = 'left';
  const lines = content.split('\n');
  let y = 320;

  lines.forEach(line => {
    wrapText(line, 55, y, 300, 20);
    y += 20;
  });
}

function wrapText(text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  let testLine;
  let metrics;
  let testWidth;

  for (let n = 0; n < words.length; n++) {
    testLine = line + words[n] + ' ';
    metrics = CTX.measureText(testLine);
    testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      CTX.fillText(line, x, y);
      line = words[n] + ' ';
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  CTX.fillText(line, x, y);
}

function downloadCard() {
  const link = document.createElement('a');
  link.download = 'debuff-card.png';
  link.setAttribute("href" ,CANVAS.toDataURL("image/png"));
  link.click();
}
