import { OrbitControls } from "./jsm/OrbitControls.js";
import { FaceToMesh } from "./face.js"

let state = {
    scene: undefined,
    camera: undefined,
    renderer: undefined,
    controls: undefined,
    model: undefined,

    bone: {},
    facemesh: undefined
}

class Mesh {
    constructor() {
        state.facemesh = new FaceToMesh()

        state.scene = new THREE.Scene();
        state.scene.background = new THREE.Color( 0xa0a0a0 );
        state.scene.fog = new THREE.Fog( 0xa0a0a0, 10, 50 );
    
        const clock = new THREE.Clock();
    
        state.camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 1, 100 );
        state.camera.position.set( 0, 1, 9 );
        state.scene.add(state.camera);
    
        state.renderer = new THREE.WebGLRenderer();
        state.renderer.setSize( window.innerWidth, window.innerHeight );
        document.querySelector("#model").appendChild( state.renderer.domElement );
        
        const dirLight = new THREE.DirectionalLight( 0xf7e5df );
        dirLight.position.set( 3, 1000, 2500 );
        dirLight.castShadow = true;
        dirLight.shadow.camera.top = 2;
        dirLight.shadow.camera.bottom = - 2;
        dirLight.shadow.camera.left = - 2;
        dirLight.shadow.camera.right = 2;
        dirLight.shadow.camera.near = 0.06;
        dirLight.shadow.camera.far = 4000;
        state.scene.add(dirLight);
        
        const hemiLight = new THREE.HemisphereLight( 0x707070, 0x444444 );
        hemiLight.position.set( 0, 120, 0 );
        state.scene.add(hemiLight);
    
    
        state.controls = new OrbitControls( state.camera, state.renderer.domElement );
    
        this.addFaceModel()
        this.animate();

    }

    animate() {
        requestAnimationFrame( this.animate.bind(this) );
        let stateFacemesh = state.facemesh.state

        //console.log(stateFacemesh.landmarks, state.bone['ORG-nose'])
        if (state.bone['ORG-nose'] !== undefined) {
            state.bone['ORG-nose'].position.x = stateFacemesh.landmarks[4].x

            console.log(state.bone['ORG-nose'].position.x)
            
        }
        state.renderer.render( state.scene, state.camera );
    }

    addFaceModel() {
        const loader = new THREE.GLTFLoader();
    
        loader.load('gltf/head.glb', ( gltf ) => {
    
                state.model = gltf.scene
                state.model.receiveShadow = true;
                state.scene.add( state.model );
    
                state.model.traverse( function ( object ) {
                    if (object.type == 'Bone') {
                        state.bone[object.name] = object
                    }
                    if ( object.isMesh ) object.castShadow = true;
                });
    
                let helper = new THREE.SkeletonHelper( state.model );
                helper.material.linewidth = 2;
                helper.visible = true;
                state.scene.add(helper);
            },
            function ( xhr ) {
    
                console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    
            },
            function ( error ) {
    
                console.log( 'An error happened' );
    
            }
        );
    }
    
}

new Mesh()