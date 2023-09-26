const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');

class FaceToMesh {
    constructor() {
        this.state = {
            landmarks: []
        }

        this.faceMesh = new FaceMesh({locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
        }});
        this.faceMesh.setOptions({
            maxNumFaces: 1,
            refineLandmarks: true,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
        });
        this.faceMesh.onResults(this.onResults.bind(this));
        

        this.startCamera()

        canvasElement.addEventListener("click", this.toggleCamera.bind(this))
    }

    toggleCamera() {
        if (canvasElement.classList.contains("hide")) {
            this.showCamera()
            return 0
        }

        this.hideCamera()
    }

    hideCamera() {
        canvasElement.classList.add("hide")
    }

    showCamera() {
        canvasElement.classList.remove("hide")
    }

    startCamera() {
        const camera = new Camera(videoElement, {
            onFrame: async () => {
                await this.faceMesh.send({image: videoElement});
            },
            width: 1280,
            height: 720
        });
        camera.start();
    }

    onResults(results) {

        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        canvasCtx.translate(canvasElement.width, 0);
        canvasCtx.scale(-1,1);
        canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

        if (results.multiFaceLandmarks) {
            for (const landmarks of results.multiFaceLandmarks) {
                drawConnectors(canvasCtx, landmarks, FACEMESH_TESSELATION, {color: '#ffffff', lineWidth: 1});
                drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_EYE, {color: '#ffffff'});
                drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_EYEBROW, {color: '#ffffff'});
                drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_IRIS, {color: '#ffffff'});
                drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_EYE, {color: '#ffffff'});
                drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_EYEBROW, {color: '#ffffff'});
                drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_IRIS, {color: '#ffffff'});
                drawConnectors(canvasCtx, landmarks, FACEMESH_FACE_OVAL, {color: '#ffffff'});
                drawConnectors(canvasCtx, landmarks, FACEMESH_LIPS, {color: '#ffffff'});
            }

            this.state.landmarks = results.multiFaceLandmarks[0]
 
        }
        canvasCtx.restore();
      }
      
}


export { FaceToMesh }