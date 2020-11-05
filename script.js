const video = document.getElementById('video')

async function run() {
  // load face detection and face expression recognition models
  await changeFaceDetector(TINY_FACE_DETECTOR)
  await faceapi.nets.ageGenderNet.load('https://ediervillaneda.github.io/faceDetector/model')
  await faceapi.nets.faceExpressionNet.loadFromUri('https://ediervillaneda.github.io/faceDetector/model'),

    changeInputSize(224)

  // try to access users webcam and stream the images
  // to the video element
  const stream = await navigator.mediaDevices.getUserMedia({ video: {} })
  const videoEl = $('#inputVideo').get(0)
  videoEl.srcObject = stream
}

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('https://ediervillaneda.github.io/faceDetector/model'),
  faceapi.nets.faceLandmark68Net.loadFromUri('https://ediervillaneda.github.io/faceDetector/model'),
  faceapi.nets.faceRecognitionNet.loadFromUri('https://ediervillaneda.github.io/faceDetector/model'),
  faceapi.nets.faceExpressionNet.loadFromUri('https://ediervillaneda.github.io/faceDetector/model'),
  faceapi.nets.ageGenderNet.loadFromUri('https://ediervillaneda.github.io/faceDetector/model')
]).then(startVideo)

function startVideo() {
  navigator.getUserMedia(
    { video: {} },
    stream => video.srcObject = stream,
    err => console.error(err)
  )
}

video.addEventListener('play', () => {
  const canvas = faceapi.createCanvasFromMedia(video);
  document.body.append(canvas);
  const displaySize = { width: video.width, height: video.height };
  faceapi.matchDimensions(canvas, displaySize);
  setInterval(async () => {
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
    faceapi.draw.drawDetections(canvas, resizedDetections);
    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
    faceapi.draw.drawFaceExpressions(canvas, resizedDetections);


  }, 100)
})