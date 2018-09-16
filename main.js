const btnPredictSingleEl = document.querySelector(".btn-predict--single");
const btnPredictPollEl = document.querySelector(".btn-predict--poll");
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

  var predictButtons = document.querySelectorAll(".btn-predict");
  var i;

  for (i = 0; i < predictButtons.length; i++) {
    predictButtons[i].disabled = true;
  }

  model = await mobilenet.load();

  showPredictionInfoSection();
  
  for (i = 0; i < predictButtons.length; i++) {
    predictButtons[i].disabled = false;
  }

  console.log("Model Loaded");
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
        if((prediction.className.toLowerCase().indexOf("bottle") !== -1 && prediction.probability > .70)) {
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

let pollingInterval;

function togglePollingPredictions() {
  if(!pollingInterval) {
    startPollingPredictions();
  } else {
    stopPollingPredictions();
  }
}

function startPollingPredictions() {
  console.log("Start Polling");
  predict();
  btnPredictSingleEl.style.display = "none";
  btnPredictPollEl.innerHTML = "Stop Polling";
  pollingInterval = setInterval(function(){ predict() }, 10000);
}

function stopPollingPredictions() {
  console.log("Stop Polling");
  btnPredictSingleEl.style.display = "";
  btnPredictPollEl.innerHTML = "Start Polling";
  clearInterval(pollingInterval);
  pollingInterval = null;
}

function init() {
  //setupGui([], null);
  loadModel();
}