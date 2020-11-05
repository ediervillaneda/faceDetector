let forwardTimes = []
let edadProyectada = []
let generoProyectado = []

function updEstadisticaTiempo(timeInMs) {
  forwardTimes = [timeInMs].concat(forwardTimes).slice(0, 30)
  const avgTimeInMs = forwardTimes.reduce((total, t) => total + t) / forwardTimes.length
  $('#time').val(`${Math.round(avgTimeInMs)} ms`)
  $('#fps').val(`${faceapi.utils.round(1000 / avgTimeInMs)}`)
}

function InterpolarPrediccionEdad(edad) {
  edadProyectada = [edad].concat(edadProyectada).slice(0, 100)
  const avgPredictedAge = edadProyectada.reduce((total, a) => total + a) / edadProyectada.length
  return avgPredictedAge
}

function InterpolarPrediccionGenero(probabilidadGenero) {
  generoProyectado = [probabilidadGenero].concat(generoProyectado).slice(0, 100)
  const avgProbabilidadGenero = generoProyectado.reduce((total, a) => total + a) / generoProyectado.length
  return avgProbabilidadGenero
}

async function onPlay() {
  const videoEl = $('#inputVideo').get(0)

  if (videoEl.paused || videoEl.ended || !isFaceDetectionModelLoaded())
    return setTimeout(() => onPlay())

  const options = getFaceDetectorOptions()

  const ts = Date.now()

  const result = await faceapi.detectSingleFace(videoEl, options)
    .withAgeAndGender().withFaceExpressions();

  updEstadisticaTiempo(Date.now() - ts)

  if (result) {
    const canvas = $('#overlay').get(0)
    const dims = faceapi.matchDimensions(canvas, videoEl, true)

    const resizedResult = faceapi.resizeResults(result, dims)
    faceapi.draw.drawDetections(canvas, resizedResult);
    faceapi.draw.drawFaceExpressions(canvas, resizedResult);

    const { age, gender, genderProbability  } = resizedResult

    // Interpolando la probabilidad del genero y la edad sobre los ultimos 100 frames,
    //hace que el valor se vea mas estable.
    const InterpolarEdad = InterpolarPrediccionEdad(age)
    const InterpolarGenero = InterpolarPrediccionGenero(genderProbability)
    new faceapi.draw.DrawTextField(
      [
        `${faceapi.utils.round(InterpolarEdad, 0)} años`,
        `${gender} (${faceapi.utils.round(InterpolarGenero * 100)}) %`
      ],
      result.detection.box.bottomRight
    ).draw(canvas)
  }

  setTimeout(() => onPlay())
}

async function run() {
  // load face detection and face expression recognition models
  await changeFaceDetector(TINY_FACE_DETECTOR);
  await faceapi.nets.ageGenderNet.load('https://ediervillaneda.github.io/faceDetector/models');
  await faceapi.nets.faceExpressionNet.loadFromUri('https://ediervillaneda.github.io/faceDetector/models');

  changeInputSize(224);

  // try to access users webcam and stream the images
  // to the video element
  const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
  const videoEl = $('#inputVideo').get(0);
  videoEl.srcObject = stream;
}

function updateResults() { }

$(document).ready(function () {
  run()
})