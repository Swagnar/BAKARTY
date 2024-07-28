const CANVAS = document.getElementById('canvas');
const CTX = CANVAS.getContext('2d');

// Image inputs
const ICON_INPUT = document.getElementById('icon__input');
const BACKGROUND_INPUT = document.getElementById('background__input');

// Card name block
const NAME_INPUT = document.getElementById('name__input');
const NAME_BACKGROUND_INPUT = document.getElementById('name-background__input');

// Card description block 
const DESCRIPTION_INPUT = document.getElementById('description__input');
const DESCRIPTION_BACKGROUND_INPUT = document.getElementById('description-background__input')

// Buttons
const GENERATE_BUTTON = document.getElementById('generate-button');
const DOWNLOAD_BUTTON = document.getElementById('download-button');

// Constant values
const CANVAS_BOXES_WIDTH = CANVAS.width - 100;
const NAME_CANVAS_BOX_HEIGHT = 60;
const DESCRIPTION_CANVAS_BOX_HEIGHT = 200;

// Setting initial background colors for name and description boxes
var nameBackgroundColor = NAME_BACKGROUND_INPUT.value;
var descriptionBackgroundColor = DESCRIPTION_BACKGROUND_INPUT.value;

// Creating, loading and appending the Vinque font
const fontFile = new FontFace(
  "FontFamily Style Vinque",
  "url(static/Vinque.otf)"
)

fontFile.load().then(function(loadedFont) {
  document.fonts.add(loadedFont);
}).catch(function(error) {
  console.error('Failed to load font:', error);
});

// Setting initial images with default values
let backgroundImage = new Image();
backgroundImage.crossOrigin = "anonymous";
backgroundImage.src = "static/background_default.png"

let iconImage = new Image(100, 100);
iconImage.crossOrigin = "anonymous";


// On loading the page, initialize event listeners and draw blank card with boxes for name and description
window.onload = () => {
  initListeners()
  drawBackground();

  // DEBUG
  // drawName("Podpalenie");
  // drawDescription("Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae fugiat ad inventore libero eos modi eaque quos accusantium consequatur esse illum tempora eligendi, quo aliquam recusandae. Placeat tempore impedit dolores.");
}

/**
 * This function adds event listeners to all DOM elements used in the app.
 */
function initListeners() {

  ICON_INPUT.addEventListener('change', function(ev) {
    handleImageUpload(ev, "ICON");
  })
  BACKGROUND_INPUT.addEventListener('change', function(ev) {
    handleImageUpload(ev, "BG");
  })

  NAME_INPUT.addEventListener('input', generateCard)
  NAME_BACKGROUND_INPUT.addEventListener('input', function() {
    nameBackgroundColor = NAME_BACKGROUND_INPUT.value;
    generateCard();
  })
  
  DESCRIPTION_INPUT.addEventListener('input', generateCard)
  DESCRIPTION_BACKGROUND_INPUT.addEventListener('input', function() {
    descriptionBackgroundColor = DESCRIPTION_BACKGROUND_INPUT.value;
    generateCard();
  })
  
  GENERATE_BUTTON.addEventListener('click', generateCard);
  DOWNLOAD_BUTTON.addEventListener('click', downloadCard);
}

function handleImageUpload(event, type) {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = function(e) {
    switch(type) {
      case "ICON":
        iconImage.src = e.target.result;
        iconImage.onload = function() {
          generateCard();
        };
        break;
      case "BG":
        backgroundImage.src = e.target.result;
        backgroundImage.onload = function() {
          generateCard();
        } 
    }
    
  };

  reader.readAsDataURL(file);
}

function generateCard() {
  const name = NAME_INPUT.value;
  const description = DESCRIPTION_INPUT.value;
  
  drawBackground();
  drawIcon();
  drawName(name);
  drawDescription(description);
}


function drawBackground() {
  CTX.clearRect(0, 0, CANVAS.width, CANVAS.height);
  if (backgroundImage.src) {
    CTX.drawImage(backgroundImage, 0, 0, CANVAS.width, CANVAS.height);
  } else {
    CTX.fillStyle = '#ffffff';
    CTX.fillRect(0, 0, CANVAS.width, CANVAS.height);
  }
  
  // Name box
  CTX.fillStyle = nameBackgroundColor;
  CTX.fillRect(50, 200, CANVAS_BOXES_WIDTH, NAME_CANVAS_BOX_HEIGHT);

  // Description box
  CTX.fillStyle = descriptionBackgroundColor;
  CTX.fillRect(50, 300, CANVAS_BOXES_WIDTH, DESCRIPTION_CANVAS_BOX_HEIGHT);
}

function drawIcon() {
  if (iconImage.src) {
    CTX.drawImage(iconImage, CANVAS.width / 2 - iconImage.width / 2, 70, iconImage.width, iconImage.height);
  }
}


function drawName(name) {
  let fontSize = 54;
  const maxFontSize = 54;
  const minFontSize = 20;
  const yCenter = 200 + NAME_CANVAS_BOX_HEIGHT / 2; 

  CTX.textAlign = 'center';
  CTX.fillStyle = '#7d6c4e';
  CTX.strokeStyle = '#473e32';
  CTX.lineWidth = 3;
  CTX.textBaseline = 'middle'; 


  do {
    CTX.font = `${fontSize}px FontFamily Style Vinque`;
    const textWidth = CTX.measureText(name).width;
    const textMetrics = CTX.measureText(name);
    const textHeight = textMetrics.actualBoundingBoxAscent + textMetrics.actualBoundingBoxDescent;
    if (textWidth <= CANVAS_BOXES_WIDTH && textHeight <= NAME_CANVAS_BOX_HEIGHT) {
      break;
    }
    fontSize--;
  } while (fontSize > minFontSize);

  CTX.font = `${fontSize}px FontFamily Style Vinque`;
  CTX.strokeText(name, CANVAS.width / 2, yCenter);
  CTX.fillText(name, CANVAS.width / 2, yCenter);
}


function drawDescription(description) {
  CTX.font = '16px "FontFamily Style Vinque"';
  CTX.fillStyle = '#bfaf8f'
  CTX.textAlign = 'left';
  const lines = description.split('\n');
  let y = 320;

  lines.forEach(line => {
    wrapText(line, 55, y, 300, 20);
    y += 20; // Adjust y for each new line
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
  link.download = `${NAME_INPUT.value}-card.png`;
  link.setAttribute("href" ,CANVAS.toDataURL("image/png"));
  link.click();
}
