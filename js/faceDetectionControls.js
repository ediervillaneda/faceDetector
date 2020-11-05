const SSD_MOBILENETV1 = 'ssd_mobilenetv1'
const TINY_FACE_DETECTOR = 'tiny_face_detector'


let selectedFaceDetector = SSD_MOBILENETV1

// ssd_mobilenetv1 options
let minConfidence = 0.5

// tiny_face_detector options
let inputSize = 512
let scoreThreshold = 0.5

function getFaceDetectorOptions() {
  return new faceapi.TinyFaceDetectorOptions({ inputSize, scoreThreshold })
}

function onIncreaseMinConfidence() {
  minConfidence = Math.min(faceapi.utils.round(minConfidence + 0.1), 1.0)
  $('#minConfidence').val(minConfidence)
  updateResults()
}

function onDecreaseMinConfidence() {
  minConfidence = Math.max(faceapi.utils.round(minConfidence - 0.1), 0.1)
  $('#minConfidence').val(minConfidence)
  updateResults()
}

function onInputSizeChanged(e) {
  changeInputSize(e.target.value)
  updateResults()
}

function changeInputSize(size) {
  inputSize = parseInt(size)

  const inputSizeSelect = $('#inputSize')
  inputSizeSelect.val(inputSize)
  inputSizeSelect.material_select()
}

function onIncreaseScoreThreshold() {
  scoreThreshold = Math.min(faceapi.utils.round(scoreThreshold + 0.1), 1.0)
  if (scoreThreshold >= 1) {
    scoreThreshold = scoreThreshold - 0.1;
  }
  $('#scoreThreshold').val(scoreThreshold)
  updateResults()
}

function onDecreaseScoreThreshold() {
  scoreThreshold = Math.max(faceapi.utils.round(scoreThreshold - 0.1), 0.1)
  if (scoreThreshold <= 0) {
    scoreThreshold = scoreThreshold + 0.1;
  }
  $('#scoreThreshold').val(scoreThreshold)
  updateResults()
}

function onIncreaseMinFaceSize() {
  minFaceSize = Math.min(faceapi.utils.round(minFaceSize + 20), 300)
  $('#minFaceSize').val(minFaceSize)
}

function onDecreaseMinFaceSize() {
  minFaceSize = Math.max(faceapi.utils.round(minFaceSize - 20), 50)
  $('#minFaceSize').val(minFaceSize)
}

function getCurrentFaceDetectionNet() {
  return faceapi.nets.tinyFaceDetector;
}

function isFaceDetectionModelLoaded() {
  return !!getCurrentFaceDetectionNet().params
}

async function changeFaceDetector(detector) {

  $('#loader').show()
  if (!isFaceDetectionModelLoaded()) {
    await getCurrentFaceDetectionNet().load('https://ediervillaneda.github.io/faceDetector/model')
  }

  $('#loader').hide()
}
