
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

import { FaceToMesh } from "./face.js"


class Mesh {
    constructor() {
        this.scene = undefined
        this.camera = undefined
        this.renderer = undefined
        this.controls = undefined
        this.model = undefined
        this.bone = {}
        this.initialBonePosition = {}
        this.dot = {}
        this.facemesh = undefined

        this.init()
    }


    init() {
        this.facemesh = new FaceToMesh()

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color( 0x000000 );
        this.scene.fog = new THREE.Fog( 0xa0a0a0, 10, 50 );
        
        this.camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.07, 100 );
        this.camera.position.set( 0, 0.1, 2 );
        this.scene.add(this.camera);
    
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize( window.innerWidth, window.innerHeight );

        this.controls = new OrbitControls( this.camera, this.renderer.domElement );

        
        const dirLight = new THREE.DirectionalLight( 0xf7e5df );
        dirLight.position.set( 3, 1000, 2500 );
        dirLight.castShadow = true;
        dirLight.shadow.camera.top = 2;
        dirLight.shadow.camera.bottom = - 2;
        dirLight.shadow.camera.left = - 2;
        dirLight.shadow.camera.right = 2;
        dirLight.shadow.camera.near = 0.06;
        dirLight.shadow.camera.far = 4000;
        this.scene.add(dirLight);
        
        const hemiLight = new THREE.HemisphereLight( 0x707070, 0x444444 );
        hemiLight.position.set( 0, 120, 0 );
        this.scene.add(hemiLight);
    
    
        this.addFaceModel()
        this.animate();

        document.querySelector("#model").appendChild( this.renderer.domElement );

    }

    animate() {
        requestAnimationFrame( this.animate.bind(this) );

        this.rotateFace()
        this.reformMouth()
        this.reformBrow()

        this.renderer.render( this.scene, this.camera );
    }

    getAngle(a,b,sX,sY) {
        let defX =  a[sX] - b[sX];
        let defY =  a[sY] - b[sY];
        let angle = Math.atan2(defY, defX);
        
        return angle;
    }

    getDistance(a,b) {
        let dist = Math.abs(a - b)
        
        return dist;
    }

    rotateFace() {
        let stateFacemesh = this.facemesh.state

        if (stateFacemesh.landmarks.length == 0) {
            return 0
        }

        let horizontalAngle = this.getAngle(stateFacemesh.landmarks[134], stateFacemesh.landmarks[454], 'x', 'z') + 2.34
        let verticalAngle = this.getAngle(stateFacemesh.landmarks[10], stateFacemesh.landmarks[152], 'y', 'z') - 3.14
        let revolvingAngle = - this.getAngle(stateFacemesh.landmarks[10], stateFacemesh.landmarks[152], 'x', 'y') - 1.58


        this.model.rotation.y = - horizontalAngle * 1.1
        this.model.rotation.x = verticalAngle 
        this.model.rotation.z = - revolvingAngle
    }
    
    reformMouth() {
        let stateFacemesh = this.facemesh.state

        if (stateFacemesh.landmarks.length == 0) {
            return 0
        }

        let heightMouth = this.getDistance(stateFacemesh.landmarks[13].y, stateFacemesh.landmarks[14].y)
        let widthMouth = this.getDistance(stateFacemesh.landmarks[291].y, stateFacemesh.landmarks[61].y)
        
        this.bone["lipB"].position.y = this.initialBonePosition["lipB"].y + heightMouth / 2
        this.bone["lipT"].position.y = this.initialBonePosition["lipT"].y - heightMouth / 3

        this.bone["lipB"].position.z = this.initialBonePosition["lipB"].z + heightMouth / 3
        this.bone["lipT"].position.z = this.initialBonePosition["lipT"].z - heightMouth / 3

        this.bone["lipTL001_1"].position.y = this.initialBonePosition["lipTL001_1"].y - heightMouth / 3
        this.bone["lipTR001_1"].position.y = this.initialBonePosition["lipTR001_1"].y - heightMouth / 3

        this.bone["jaw_master"].position.y = this.initialBonePosition["jaw_master"].y - heightMouth / 3


    }


    reformBrow() {
        let stateFacemesh = this.facemesh.state

        if (stateFacemesh.landmarks.length == 0) {
            return 0
        }

        let rightBrow = this.getDistance(stateFacemesh.landmarks[386].y, stateFacemesh.landmarks[282].y)
        let leftBrow = this.getDistance(stateFacemesh.landmarks[159].y, stateFacemesh.landmarks[52].y)

        let leftEye = this.getDistance(stateFacemesh.landmarks[145].y, stateFacemesh.landmarks[159].y)
        let rightEye = this.getDistance(stateFacemesh.landmarks[374].y, stateFacemesh.landmarks[386].y)

        let headDist = this.getDistance(stateFacemesh.landmarks[103].x, stateFacemesh.landmarks[332].x)

        let relativeEyes = (0.4 * headDist / 2)
        
        this.bone["browTL002"].position.y = this.initialBonePosition["browTL002"].y + rightBrow / 2
        this.bone["browTL001"].position.y = this.initialBonePosition["browTL001"].y + rightBrow / 2
        this.bone["browTL003"].position.y = this.initialBonePosition["browTL003"].y + rightBrow / 2

        this.bone["browTR002"].position.y = this.initialBonePosition["browTR002"].y + leftBrow / 2
        this.bone["browTR001"].position.y = this.initialBonePosition["browTR001"].y + leftBrow / 2
        this.bone["browTR003"].position.y = this.initialBonePosition["browTR003"].y + leftBrow / 2


        this.bone["MCH-lidTL002"].position.z = this.initialBonePosition["MCH-lidTL002"].z + (leftEye * 2) - relativeEyes
        this.bone["MCH-lidTL001"].position.z = this.initialBonePosition["MCH-lidTL001"].z + (leftEye * 2) - relativeEyes
        this.bone["MCH-lidTL003"].position.z = this.initialBonePosition["MCH-lidTL003"].z + (leftEye * 2) - relativeEyes

        this.bone["MCH-lidTR002"].position.z = this.initialBonePosition["MCH-lidTR002"].z + (rightEye * 2) - relativeEyes
        this.bone["MCH-lidTR001"].position.z = this.initialBonePosition["MCH-lidTR001"].z + (rightEye * 2) - relativeEyes
        this.bone["MCH-lidTR003"].position.z = this.initialBonePosition["MCH-lidTR003"].z + (rightEye * 2) - relativeEyes


        //this.bone["lipT"].position.y = this.initialBonePosition["lipT"].y - heightMouth / 2
    }

    addFaceModel() {
        const loader = new THREE.GLTFLoader();
    
        loader.load('gltf/result.glb', ( gltf ) => {
    
                this.model = gltf.scene
                this.model.receiveShadow = true;
    
                this.model.traverse( ( object ) => {
                    if (object.type == 'Bone') {
                        this.bone[object.name] = object
                        this.initialBonePosition[object.name] = { 
                            x: object.position.x,
                            y: object.position.y,
                            z: object.position.z

                         }
                    }
                    if ( object.isMesh ) object.castShadow = true;
                });

                this.scene.add( this.model );

    
                // let helper = new THREE.SkeletonHelper( this.model );
                // helper.material.linewidth = 2;
                // helper.visible = true;
                // this.scene.add(helper);

                
            }, ( xhr ) => {

                const total = xhr.loaded / xhr.total * 100
    
                document.querySelector("#percent").innerHTML = `${Math.floor(total)}%`

                if (total > 99) {
                    this.fadeLoadAnimation()
                }
    
            },
            function ( error ) {
    
                console.log( 'An error happened' );
    
            }
        );
    }

    fadeLoadAnimation() {
        setTimeout(() => {
            document.querySelector("#load").classList.add('fadeout')

        }, 2000); 

        setTimeout(() => {

            document.querySelector("#load").classList.add('d-none')

        }, 2500);
    }
    
}


new Mesh()