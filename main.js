const btnPredictEl = document.querySelector(".btn-predict");
const recyclableResultEl = document.querySelector(".recyclable-result-container");
const predictionInfoContainerEl = document.querySelector("#predictionInfoContainer");
const predictionResultEl = document.querySelector("#result");
const predictionErrorEl = document.querySelector("#predictionError");
const predictionLoadingEl = document.querySelector("#predictionLoading");
const modelLoadingEl = document.querySelector("#modelLoading");

let model = null;

/*
const guiState = {
  actions: {
    predictButton: function() {
      console.log("clicked");
      predict();
    }
  },
  net: null
};
*/

/**
 * Sets up dat.gui controller on the top-right of the window
 */
/*
function setupGui(cameras, net) {
  guiState.net = net;
  
  if (cameras.length > 0) {
    guiState.camera = cameras[0].deviceId;
  }
  
  const gui = new dat.GUI({width: 300});

  let actions = gui.addFolder('Actions');

  actions.add(guiState.actions,'predictButton').name("Predict");

  actions.open();

}*/

function showPredictionInfoSection(elementToShow) {
  //predictionInfoContainerEl.style.display = "none";
  predictionResultEl.style.display = "none";
  predictionErrorEl.style.display = "none";
  predictionLoadingEl.style.display = "none";
  modelLoadingEl.style.display = "none";

  if(elementToShow) {
    elementToShow.style.display = "block";
  }
}

async function loadModel() {
  showPredictionInfoSection(modelLoadingEl);
  btnPredictEl.disabled = true;

  model = await mobilenet.load();

  showPredictionInfoSection();
  btnPredictEl.disabled = false;
}

const predict = async() => {
  console.log("predicting...");

  recyclableResultEl.innerHTML = "...";
  
  if(!model) {
    loadModel();
  }
  showPredictionInfoSection(predictionLoadingEl);
  model.classify(video).then(predictions => {
    showPredictionInfoSection(predictionResultEl);

    recyclableResultEl.innerHTML = "Recyclable";

    console.log("Predictions: ", predictions);
    // update ui elements

    var range = document.createRange();
    range.selectNodeContents(predictionResultEl);
    range.deleteContents();

    let recyclable = false;

    predictions.forEach(prediction => {
      if(!recyclable) {
        if((prediction.className.toLowerCase().indexOf("bottle") !== -1 && prediction.probability > .80)) {
          recyclableResultEl.innerHTML = "Recyclable";
          recyclable = true;
        } else {
          recyclableResultEl.innerHTML = "Not Recyclable";
        }
      }
      var newEl = document.createElement("div");
      var newTextEl = document.createTextNode(prediction.className + ' - ' + (prediction.probability * 100).toFixed(2) + '% probability');
      newEl.appendChild(newTextEl);
      predictionResultEl.appendChild(newEl);
    });

  });
};

function init() {
  //setupGui([], null);
  loadModel();
}