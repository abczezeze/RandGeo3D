var container
var camera, controls, scene, renderer
var textureLoader
var clock = new THREE.Clock()
var ball,fa01
var mouseMesh
var ambientLight
var rb88 = new THREE.Object3D();
var listener = new THREE.AudioListener();

// Physics variables
var gravityConstant = -9.8
var collisionConfiguration
var dispatcher
var broadphase
var solver
var physicsWorld
var rigidBodies = []
var margin = 0.05
var transform
var transformAux1 = new Ammo.btTransform()
var raycal = new THREE.Vector3()
var pos = new THREE.Vector3()
var quat = new THREE.Quaternion()
var time = 0
var ballnum=0
var ballshooter = []

//initInput
var mouseCoords = new THREE.Vector2()
var raycaster = new THREE.Raycaster()
var clickRequest=false
var boxes = []
var clickcount=0
var intersects
var startButton = document.getElementById('start-button')
startButton.addEventListener('click',init)
var crButton = document.getElementById('credit-button')
crButton.addEventListener('click',showCredit)
var crlg = document.getElementById('creditlg')

creditlg.addEventListener('click',hideCredit)
function showCredit(){
  creditlg.style.display = 'block'
}
function hideCredit(){
  creditlg.style.display = 'none'
}
// - Main code -
//init()
animate()
// - Functions -
//เรียกใข้ฟังก์ชั่นที่จะดำเนินการ
function init() {
  var title = document.getElementById('title')
  title.remove()
  var loadwait = document.getElementById('loadwait')
  loadwait.remove()
  initGraphics()
  initPhysics()
  createObjects()
  initInput()
}

function initGraphics() {
  scene = new THREE.Scene()
  //scene.background = new THREE.Color( 0xbfd1e5 )
  scene.background = new THREE.CubeTextureLoader()
      .setPath( 'tt/skybox/' )
      .load( [ 'left.png', 'right.png', 'top.png', 'bottom.png', 'front.png', 'back.png' ] );

  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 )
  camera.position.set(0,0,5)
  camera.lookAt(scene.position)

  renderer = new THREE.WebGLRenderer({antialias:true,alpha:true})
  renderer.setPixelRatio( window.devicePixelRatio )
  renderer.setSize( window.innerWidth, window.innerHeight )
  renderer.shadowMap.enabled = true
  effcutout = new THREE.OutlineEffect(renderer)
  container = document.getElementById( 'container' )
  container.appendChild(renderer.domElement);

  ambientLight = new THREE.AmbientLight( 0x404040 )
  scene.add( ambientLight )

  var light = new THREE.DirectionalLight( 0xffffff, 1 )
  light.position.set( -10, 10, 5 )
  light.castShadow = true
  light.shadow.camera.left = -10
  light.shadow.camera.right = 10
  light.shadow.camera.top = 10
  light.shadow.camera.bottom = -10
  light.shadow.camera.near = 2
  light.shadow.camera.far = 50
  light.shadow.mapSize.x = 1024
  light.shadow.mapSize.y = 1024
  scene.add( light )
  //sound

  camera.add( listener );
  var sound = new THREE.Audio( listener );
  var audioLoader = new THREE.AudioLoader();
  audioLoader.load( 'sound/firstmp.mp3', function( buffer ) {
	    sound.setBuffer( buffer );
	    sound.setLoop( true );
	    sound.setVolume( 0.3 );
	    sound.play();
  });

  //html-css
  coucik = document.getElementById("coucik")
  coucik.style.position = 'absolute'
  coucik.style.bottom = '55px'
  coucik.style.textAlign = 'left'
  coucik.style.color = '#990000'
  lobj = document.getElementById("lobj")
  lobj.style.position = 'absolute'
  lobj.style.bottom = '70px'
  lobj.style.textAlign = 'left'
  lobj.style.color = '#9900ff'

  window.addEventListener( 'resize', onWindowResize, false )
}

function initPhysics() {
  // Physics configuration ตั้งค่าฟิสิกส์ที่จะใช้เบื้องต้น
  collisionConfiguration = new Ammo.btDefaultCollisionConfiguration()
  dispatcher = new Ammo.btCollisionDispatcher( collisionConfiguration )
  broadphase = new Ammo.btDbvtBroadphase()
  solver = new Ammo.btSequentialImpulseConstraintSolver()
  physicsWorld = new Ammo.btDiscreteDynamicsWorld( dispatcher, broadphase, solver, collisionConfiguration )
  physicsWorld.setGravity( new Ammo.btVector3( 0, 0, -gravityConstant ) )
}

//3D models
function createObjects() {
  //ซ่อน
  var bodyGeometry = new THREE.CubeGeometry(10,15,10)
  var bodyMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe:true} )
  mouseMesh = new THREE.Mesh( bodyGeometry, bodyMaterial )
  mouseMesh.visible = false;
  mouseMesh.position.z = 0
	scene.add( mouseMesh )
  //หัว
  var headGeo = new THREE.IcosahedronGeometry(0.5,0);
  var headMat = new THREE.MeshLambertMaterial( {color:0x3300aa,wireframe:true});
  var headMesh = new THREE.Mesh(headGeo,headMat);
  headMesh.position.y=1;
  headMesh.position.x=0;
  rb88.add(headMesh);
  //คอ
  var neckGeo = new THREE.CylinderGeometry(0.5,1.2,0.2);
  var neckMat = new THREE.MeshLambertMaterial( {color:0x003300,wireframe:true});
  var neckMesh = new THREE.Mesh(neckGeo,neckMat);
  neckMesh.position.y=0.6;
  neckMesh.position.x=0;
  rb88.add(neckMesh);
  //ลำตัว
  var bodyGeo = new THREE.BoxGeometry(1,1.5,1);
  var bodyMat = new THREE.MeshLambertMaterial( {color:0x00aa22,wireframe:true});
  var bodyMesh = new THREE.Mesh(bodyGeo,bodyMat);
  bodyMesh.position.set(0,-0.2,0);
  rb88.add(bodyMesh);
  //แขนขวา
  var armRGeo = new THREE.CylinderGeometry(0.09,0.2,1);
  var armRMat = new THREE.MeshLambertMaterial( {color:0xaa2200,wireframe:true});
  var armRMesh = new THREE.Mesh( armRGeo, armRMat );
  armRMesh.position.set(-0.66,-0,0);
  rb88.add(armRMesh);
  //แขนซ้าย
  var armLGeo = new THREE.CylinderGeometry(0.09,0.2,1);
  var armLMat = new THREE.MeshLambertMaterial( {color:0xaa2200,wireframe:true});
  var armLMesh = new THREE.Mesh( armLGeo, armLMat );
  armLMesh.position.set(0.66,0,0);
  rb88.add(armLMesh);
  //มือขวา
  var handRGeo = new THREE.SphereGeometry(0.2,8,8);
  var handRMat = new THREE.MeshLambertMaterial( {color:0x222255,wireframe:true});
  var handRMesh = new THREE.Mesh( handRGeo, handRMat );
  handRMesh.position.set(-0.66,-0.66,0);
  rb88.add(handRMesh);
  //มือซ้าย
  var handLGeo = new THREE.SphereGeometry(0.2,8,8);
  var handLMat = new THREE.MeshLambertMaterial( {color:0x222255,wireframe:true});
  var handLMesh = new THREE.Mesh( handLGeo, handLMat );
  handLMesh.position.set(0.66,-0.66,0);
  handLMesh.rotation.x = 2.8;
  rb88.add(handLMesh);
  //ขาขวา
  var legRGeo = new THREE.CylinderGeometry(0.2,0.09,2);
  var legRMat = new THREE.MeshLambertMaterial( {color:0xaa2200,wireframe:true});
  var legRMesh = new THREE.Mesh( legRGeo, legRMat );
  legRMesh.position.set(-0.3,-1,0);
  rb88.add(legRMesh);
  //ขาซ้าย
  var legLGeo = new THREE.CylinderGeometry(0.2,0.09,2);
  var legLMat = new THREE.MeshLambertMaterial( {color:0xaa2200,wireframe:true});
  var legLMesh = new THREE.Mesh( legLGeo, legLMat );
  legLMesh.position.set(0.3,-1,0);
  rb88.add(legLMesh);
  //เท้าขวา
  var footRGeo = new THREE.BoxGeometry(0.2,0.2,0.5);
  var footRMat = new THREE.MeshLambertMaterial( {color:0x222255,wireframe:true});
  var footRMesh = new THREE.Mesh( footRGeo, footRMat );
  footRMesh.position.set(-0.3,-1.99,0.11);
  rb88.add(footRMesh);
  //เท้าซ้าย
  var footLGeo = new THREE.BoxGeometry(0.2,0.2,0.5);
  var footLMat = new THREE.MeshLambertMaterial( {color:0x222255,wireframe:true});
  var footLMesh = new THREE.Mesh( footLGeo, footLMat );
  footLMesh.position.set(0.3,-1.99,0.11);
  rb88.add(footLMesh);
  scene.add(rb88);
}

function createBox(){
  let boxX = 1+ Math.random() * 3
  let boxY = 1+ Math.random() * 3
  let boxZ = 1+ Math.random() * 3
  let boxMass = 1
  let arrayTexture = ['tt/mcManisFs_nm.png','tt/mcMuaFS_nm.png','tt/mcMonChok_nm.png']
  let randIndex = THREE.Math.randInt(0,arrayTexture.length-1)
  //console.log('randIndex=',randIndex);
  let boxTexture = new THREE.TextureLoader().load( arrayTexture[randIndex] );
  let boxMesh = new THREE.Mesh(new THREE.BoxBufferGeometry(boxX,boxY,boxZ,1,1,1),new THREE.MeshPhongMaterial( { color: Math.random()*0xffffff, normalMap: boxTexture} ))
  //canMesh.geometry.translate(0,0,10)
  boxMesh.castShadow = true
	boxMesh.receiveShadow = true
  //canMesh.name = "Can"+numCan++
  let boxPS = new Ammo.btBoxShape( new Ammo.btVector3(boxX*0.5,boxY*0.5,boxZ*0.5 ) )
  boxPS.setMargin(margin)
  pos.set( THREE.Math.randInt(-10,10), THREE.Math.randInt(-10,10), -100 )
  quat.set( THREE.Math.randInt(-10,10), 0, THREE.Math.randInt(-10,10), THREE.Math.randInt(-100  ,100) )
  createRigidBody( boxMesh, boxPS, boxMass, pos, quat )
  boxes.push(boxMesh)
}

function createCan(){
  let cldRadius = .6+ Math.random() *3
  let cldHeight = 0.8+ Math.random() *3
  let cldMass = 0.5
  let arrayTexture = ['tt/MrA_nm.png','tt/MrB_nm.png','tt/MrC_nm.png']
  let randIndex = THREE.Math.randInt(0,arrayTexture.length-1)
  let cldTexture = new THREE.TextureLoader().load( arrayTexture[randIndex] );
  let cylinderMesh = new THREE.Mesh(new THREE.CylinderBufferGeometry(cldRadius,cldRadius,cldHeight,20,1),new THREE.MeshPhongMaterial( { color:Math.random()*0xffffff, normalMap: cldTexture } ))
  cylinderMesh.castShadow = true
  cylinderMesh.receiveShadow = true
  //สร้างฟิสิกส์รูปทรงกระบอก
  let cylinderPhysicsShape = new Ammo.btCylinderShape( new Ammo.btVector3(cldRadius,cldHeight * 0.5,cldRadius ) )
  cylinderPhysicsShape.setMargin(margin)   //ขอบวัตถุ
  pos.set( THREE.Math.randInt(-10,10), THREE.Math.randInt(-10,10), -100 )   //กำหนดตำแหน่ง
  quat.set( THREE.Math.randInt(-10,10), 0, THREE.Math.randInt(-10,10), THREE.Math.randInt(-10,10) )   //กำหนดการหมุน
  createRigidBody( cylinderMesh, cylinderPhysicsShape, cldMass, pos, quat )
  boxes.push(cylinderMesh)
}

function createCone(){
  let coneRadius = 1+ Math.random() *2
  let coneHeight = 2+ Math.random() *2
  let coneMass = 1.5
  let arrayTexture = ['tt/fm_jaja_nm.png','tt/fm_jina_nm.png','tt/fm_mama_nm.png','tt/fm_moya_nm.png']
  let randIndex = THREE.Math.randInt(0,arrayTexture.length-1)
  let coneTexture = new THREE.TextureLoader().load( arrayTexture[randIndex] );
  let coneMesh = new THREE.Mesh(new THREE.ConeBufferGeometry( coneRadius, coneHeight, 20, 2 ),new THREE.MeshPhongMaterial( { color:Math.random()*0xffffff, normalMap: coneTexture} ))
  coneMesh.castShadow = true
  coneMesh.receiveShadow = true
  let conePhysicsShape = new Ammo.btConeShape( coneRadius,coneHeight )
  conePhysicsShape.setMargin(margin)   //ขอบวัตถุ
  pos.set( THREE.Math.randInt(-10,10), THREE.Math.randInt(-10,10), -100 )   //กำหนดตำแหน่ง
  quat.set( THREE.Math.randInt(-10,10), 0, THREE.Math.randInt(-10,10), THREE.Math.randInt(-10,10) )   //กำหนดการหมุน
  createRigidBody( coneMesh, conePhysicsShape, coneMass, pos, quat )
  boxes.push(coneMesh)
}

/*function createSphere(){
  let sphereRadius = 1 + Math.random() * 2
  let sphereMass = 1.2
  let sphereMesh = new THREE.Mesh(new THREE.SphereBufferGeometry( radius, 20, 20 ),new THREE.MeshPhongMaterial( { color:Math.random()*0xffffff} ))
  sphereMesh.castShadow = true
  sphereMesh.receiveShadow = true
  let spherePhysicsShape = Ammo.btSphereShape( sphereRadius )
  spherePhysicsShape.setMargin(margin)   //ขอบวัตถุ
  pos.set( THREE.Math.randInt(-10,10), 0, -100 )   //กำหนดตำแหน่ง
  quat.set( 0, 0, 0, 0)
  createRigidBody( sphereMesh, spherePhysicsShape, sphereMass, pos, quat )
  boxes.push(sphereMesh)
}*/

function createRigidBody( threeObject, physicsShape, mass, pos, quat ) {
  threeObject.position.copy( pos )
  threeObject.quaternion.copy( quat )
  transform = new Ammo.btTransform()
  transform.setIdentity()
  transform.setOrigin( new Ammo.btVector3( pos.x, pos.y, pos.z ) )
  transform.setRotation( new Ammo.btQuaternion( quat.x, quat.y, quat.z, quat.w ) )
  var motionState = new Ammo.btDefaultMotionState( transform )
  var localInertia = new Ammo.btVector3( 0, 0, 0 )
  physicsShape.calculateLocalInertia( mass, localInertia )
  var rbInfo = new Ammo.btRigidBodyConstructionInfo( mass, motionState, physicsShape, localInertia )
  var body = new Ammo.btRigidBody( rbInfo )
  threeObject.userData.physicsBody = body
  scene.add( threeObject )
  if ( mass > 0 ) {
    rigidBodies.push(threeObject)
    // Disable deactivation
    body.setActivationState(4)
  }
  physicsWorld.addRigidBody(body)
    return body
}

function initInput() {
  window.addEventListener('touchstart',function(event){
    event.preventDefault()
    event.clientX = event.touches[0].clientX
    event.clientY = event.touches[0].clientY
    onDocumentMouseDown( event )
  },false)
  window.addEventListener('mousemove',onDocumentMousemove,false)
  window.addEventListener('mousedown',onDocumentMouseDown,false)
}

function onDocumentMousemove(event){
  event.preventDefault()
  mouseCoords.x = (event.clientX/window.innerWidth)*2-1
  mouseCoords.y = -(event.clientY/window.innerHeight)*2+1
  // Make the sphere follow the mouse
  var vector = new THREE.Vector3(mouseCoords.x, mouseCoords.y, 0.5);
  vector.unproject( camera );
  var dir = vector.sub( camera.position ).normalize();
  var distance = - camera.position.z / dir.z;
  var wpos = camera.position.clone().add( dir.multiplyScalar( distance ) );
  //mouseMesh.position.copy(wpos);
  rb88.position.copy(wpos);
}
//กรณีการจิ้มในมือถือเรียกใช้ฟังก์ชั่นคลิกในคอมพิวเตอร์

function onDocumentMouseDown(event){
  event.preventDefault()
  ballnum++
  //console.log("ballnum ",ballnum);
  mouseCoords.x = (event.clientX/window.innerWidth)*2-1
  mouseCoords.y = -(event.clientY/window.innerHeight)*2+1
  raycaster.setFromCamera(mouseCoords,camera)
  intersects = raycaster.intersectObjects(scene.children)
  //intersectscans = raycaster.intersectObjects(boxes)
  //lo = cans[0].position.y
  //console.log(intersectscans[0].object.name+"=can.y="+lo)

    // Creates a ball
    let ballMass = 100
    let ballRadius = 0.4
    let ball = new THREE.Mesh( new THREE.SphereBufferGeometry( ballRadius, 20, 20 ), new THREE.MeshPhongMaterial( { color: 0x111111 } ) )
    ball.castShadow = true
    ball.receiveShadow = true
    ball.name = "ball"+ballnum
    ballshooter.push(ball)
    let ballShape = new Ammo.btSphereShape( ballRadius )
    ballShape.setMargin( margin )
    pos.copy( raycaster.ray.direction )
    pos.add( raycaster.ray.origin )
    quat.set( 0, 0, 0, 1 )
    let ballBody = createRigidBody( ball, ballShape, ballMass, pos, quat )
    ballBody.setFriction( 0.5 )
    pos.copy( raycaster.ray.direction )
    pos.multiplyScalar( 30 )
    ballBody.setLinearVelocity( new Ammo.btVector3( pos.x, pos.y, pos.z ) )
  if (intersects.length>0) {
    clickcount++
  }

  var audio = new THREE.Audio( listener );
  ball.add( audio );
  var shootsound = new THREE.AudioLoader();
  shootsound.load( 'sound/shootsound.mp3', function( buffer ) {
	    audio.setBuffer( buffer );
	    audio.setLoop( false );
	    audio.setVolume( 0.9 );
      audio.play();
  });
  /*cans.forEach(
    (element, index, array) =>
    console.log(element, index, array)
  )
  console.log("Haha: ",ballBody.getWorldTransform());
  for(let key in ballBody){
    console.log(key, '=>', ballBody[key])
  }*/

}
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize( window.innerWidth, window.innerHeight )
}

function animate() {
  requestAnimationFrame( animate )
  //controls.update()
  render()
}

function render() {
  var deltaTime = clock.getDelta()
  updatePhysics( deltaTime )

  //renderer.autoClear = false;
	//renderer.clear();
  //renderer.render( scene, camera )
  effcutout.autoClear = false;
  effcutout.clear();
  effcutout.render(scene, camera)
  //พิมพ์วินาทีบนหน้าเว็บ
  time += deltaTime
  lobj.innerText = "time: "+time.toFixed( 2 )
  //console.log("time="+time)
}

var originPoint = mouseMesh.position.clone()

function updatePhysics( deltaTime ) {

  physicsWorld.stepSimulation( deltaTime, 50 )

  // Update rigid bodies วัตถุเมื่อใส่ฟิสิกส์มีการเคลื่อนไหวตลอดจึงสร้างฟังก์ชั่นนี้
  for ( var i = 0, il = rigidBodies.length ;  i < il ;  i++ ) {
    var objThree = rigidBodies[ i ]
    var objPhys = objThree.userData.physicsBody
    var ms = objPhys.getMotionState()
    if ( ms ) {
      ms.getWorldTransform( transformAux1 )
      var p = transformAux1.getOrigin()
      var q = transformAux1.getRotation()
      objThree.position.set( p.x(), p.y(), p.z() )
      objThree.quaternion.set( q.x(), q.y(), q.z(), q.w() )
    }
  }
  //console.log(THREE.Math.randInt(-30,30));
  //console.log(deltaTime);
  let randCreate = THREE.Math.randInt(-20,20)
  if(randCreate==1){
    createBox()
    coucik.style.color = '#990000'
    //mouseMesh.material.color.setHex( 0xaa0000 );
  }
  if(clickcount>=20&&randCreate==10){
    createCan()
    coucik.style.color = '#00bb00'
    //mouseMesh.material.color.setHex( 0x00bb00 );
  }
  if(clickcount>=50&&randCreate==-10){
    createCone()
    coucik.style.color = '#0000ff'
    //mouseMesh.material.color.setHex( 0x0000ff );
  }
  for (var vertexIndex = 0; vertexIndex < mouseMesh.geometry.vertices.length; vertexIndex++)
	{
		var localVertex = mouseMesh.geometry.vertices[vertexIndex].clone();
		var globalVertex = localVertex.applyMatrix4( mouseMesh.matrix );
		var directionVector = globalVertex.sub( mouseMesh.position );

		var ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );
		var collisionResults = ray.intersectObjects( boxes );
		if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() ){
      collisionResults[0].object.material.opacity = 0.5
      collisionResults[0].object.material.transparent = true
      clickcount--
    }
    //console.log(collisionResults[0])
	}
  var raycasterball = new THREE.Raycaster(mouseCoords,camera)
  var ballintersects = raycaster.intersectObjects(ballshooter)
  if(ballintersects.length>0){
    if(ballintersects[0].object.position.z>10)scene.remove(ballintersects[0].object)
    //console.log(ballintersects[0].object.name);
    //console.log(ballintersects[0].object.position);
    console.log(ballintersects[0].object.name,' remove');
  }

  //พิมพ์ค่าจำนวนที่ได้นับไว้บนหน้าเว็บ
  coucik.innerText = "Score: "+clickcount
  //console.log('click',clickcount);
}
