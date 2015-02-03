if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var container, stats;

var camera, scene, scene2, renderer, controls;

var globalUniforms, spinner, feedbackShader, baseShader, baseTexture;
var mouseX = 0, mouseY = 0;
init();
animate();

function init() {
	width = window.innerWidth;
	height = window.innerHeight;
	container = document.getElementById( 'container' );
	scene = new THREE.Scene();
	scene2 = new THREE.Scene();
	scene3 = new THREE.Scene();

	camera = new THREE.Camera();
	camera.position.z = 1;

	pCamera = new THREE.PerspectiveCamera(15, window.innerWidth / window.innerHeight, 1, 100000 );
	pCamera.position.z = 2;

	renderer = new THREE.WebGLRenderer({preserveDrawingBuffer:true});
	renderer.setClearColor(0xffffff, 1);
	// renderer.autoClearColor = false;
	renderer.setSize(width, height);
	container.appendChild( renderer.domElement );


	rt1 = new THREE.WebGLRenderTarget(width, height, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter, format: THREE.RGBFormat });
    rt2 = new THREE.WebGLRenderTarget(width, height, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter, format: THREE.RGBFormat });
    test = new THREE.WebGLRenderTarget(width, height, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter, format: THREE.RGBFormat });

	globalUniforms = {
		time: { type:'f', value: 1.0 },
		resolution: { type:'v2', value: new THREE.Vector2() }
	}
	var planeGeometry = new THREE.PlaneBufferGeometry(2,2);
	var sphereGeometry = new THREE.SphereGeometry( 10, 64, 32);

	baseTexture = new THREE.ImageUtils.loadTexture("textures/pearl.jpg");
	var feedbackUniforms = {
		texture: { type:'t', value: baseTexture },
		time: globalUniforms.time,
		resolution: globalUniforms.resolution
	}
    baseShader = new THREE.ShaderMaterial({
		uniforms: feedbackUniforms,
		vertexShader: document.getElementById( 'vertexShader' ).textContent,
		fragmentShader: document.getElementById( 'baseFs' ).textContent
	});
    mesh1 = new THREE.Mesh(planeGeometry, baseShader);
	scene.add(mesh1);

	var uniforms = {
		texture: { type: 't', value: rt1},
		time: globalUniforms.time,
		resolution: globalUniforms.resolution
	}
    feedbackShader = new THREE.ShaderMaterial({
		uniforms: uniforms,
		vertexShader: document.getElementById( 'vertexShader' ).textContent,
		fragmentShader: document.getElementById( 'feedbackFs' ).textContent,
		side: THREE.DoubleSide
	});
	mesh2 = new THREE.Mesh(planeGeometry, feedbackShader)
	// scene2.add(mesh2);

	var sphereUniforms = {
		texture: {type: 't', value: test}
	}
	// sphereShader = new THREE.ShaderMaterial({
	// 	uniforms: sphereUniforms,
	// 	vertexShader: document.getElementById( 'vertexShader' ).textContent,
	// 	fragmentShader: document.getElementById( 'baseFs' ).textContent,
	// 	side: THREE.DoubleSide
	// })
	var object = new THREE.Object3D();
	var sphereMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
	sphere = new THREE.Mesh(planeGeometry, feedbackShader);
	sphere.position.set(0,0,0);
	object.add(sphere);
	object.position.set(0,0,0);
	scene2.add(object);

	var canvasTex = new THREE.Texture(renderer.domElement);
	var canvasMaterial = new THREE.MeshBasicMaterial( {map: canvasTex, side:THREE.DoubleSide } );
	var canvasGeom = new THREE.BoxGeometry(2,2,2);
	var canvas = new THREE.Mesh(canvasGeom,canvasMaterial);
	scene3.add(canvas);

	onWindowResize();

	window.addEventListener( 'resize', onWindowResize, false );
	window.addEventListener('mousemove', onDocumentMouseMove, false);

}

function onWindowResize( event ) {

	globalUniforms.resolution.value.x = window.innerWidth;
	globalUniforms.resolution.value.y = window.innerHeight;


	renderer.setSize( window.innerWidth, window.innerHeight );

}
function onDocumentMouseMove(event) {

	mouseX = ( event.clientX - window.innerWidth/2 ) * 4;
	mouseY = ( event.clientY - window.innerHeight/2 ) * 4;

}
//

function animate() {

	requestAnimationFrame( animate );

	render();
	// stats.update();

}
var updateVideo = true;
var translate = false;
var inc = 0;
var mesh1,mesh2;
function render() {

	baseShader.uniforms.texture.value = baseTexture;
	feedbackShader.uniforms.texture.value = rt1;

	globalUniforms.time.value += 0.05;
	// spinner.rotation.y = Date.now() * 0.0001;
	// spinner.rotation.z = Date.now() * 0.1;
	// spinner.rotation.x = Date.now() * 0.1;
	// mesh.rotation.x = Date.now() * 0.0005;
	// mesh.rotation.y = Date.now() * 0.0002;	
	// mesh.rotation.z = Date.now() * 0.0005;	// stats.update();

	inc++
	if(inc >= 10){
		updateVideo = false;
	}
	if(updateVideo){
		// renderer.render(scene, camera, rt1, false);				
		renderer.render(scene, camera);				
	}
	else if (updateVideo == false){
		translate = true;
	}

	// renderer.render( scene2, camera, rt2, true );
	// renderer.render(scene3, camera, test,true );
	// renderer.render(scene2, camera);
	// renderer.render(scene3, camera);

	var a = rt2;
	rt2 = rt1;
	rt1 = a;
	// controls.update();

}
