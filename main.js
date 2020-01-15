var container
var camera, controls, scene, renderer
var textureLoader
var clock = new THREE.Clock()
var ballMesh
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
var ballnum = 0
var ballshooter = []
var boxnum = 0

//initInput
var mouseCoords = new THREE.Vector2()
var raycaster = new THREE.Raycaster()
var boxes = []
var clickcount=0
var intersectscans
//DataFirebase
var playerName = "Anonymously"
var playerIp = "1.1.1.1"
var playerCoutry = "Country"
var gamescore = 0
var gametime = 0

//Html
var htmlTime, htmlScore, htmlPlayer, htmlCountry, htmlIp, btn
//Start
var startCenter = document.createElement('center')
var labelName = document.createElement('label')
labelName.innerHTML = "Please input name"
labelName.setAttribute('for','pyname')
labelName.style.position = 'Absolute'
labelName.style.top = '200px'
labelName.style.textShadow = '0 0 4px #ffffff'
startCenter.appendChild(labelName)
var inputName = document.createElement('input')
inputName.style.position = 'Absolute'
inputName.style.top = '220px'
inputName.style.textAlign = 'left'
inputName.setAttribute('type','text')
inputName.setAttribute('id','pyname')
inputName.setAttribute('placeholder','PlayerName')
startCenter.appendChild(inputName)
var startButton = document.createElement('button')
startButton.innerHTML = 'Start Game'
startButton.style.position = 'Absolute'
startButton.style.top = '250px'
startButton.style.textAlign = 'center'
startButton.addEventListener('click',startGame)
startCenter.appendChild(startButton)
document.body.appendChild(startCenter)

function startGame(){
  clickcount=0
  time=0
  gamescore=0
  gametime=0
  labelName.remove()
  inputName.remove()
  startButton.remove()
  playerName = inputName.value==''?'Anonymously':inputName.value
  htmlPlayer.innerText = "Player: "+playerName
  btn.disabled = false
  initInput()
}

// - Main code -
init()
animate()

// - Functions -
//เรียกใข้ฟังก์ชั่นที่จะดำเนินการ
function init() {
  var loadwait = document.getElementById('loadwait')
  loadwait.remove()
  let creditlg = document.getElementById('creditlg')
  creditlg.remove()
  initGraphics()
  initPhysics()
  createObjects()
  // initInput()
}

function initGraphics() {
  scene = new THREE.Scene()
  //scene.background = new THREE.Color( 0xbfd1e5 )
  scene.background = new THREE.CubeTextureLoader()
      .setPath( 'tt/skybox/' )
      .load( [ 'left.png', 'right.png', 'top.png', 'bottom.png', 'front.png', 'back.png' ] );

  camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 )
  camera.position.set(0,0,6)
  camera.lookAt(scene.position)

  renderer = new THREE.WebGLRenderer({antialias:true,alpha:true})
  renderer.setPixelRatio( window.devicePixelRatio )
  renderer.setSize( window.innerWidth, window.innerHeight )
  renderer.shadowMap.enabled = true

  container = document.getElementById( 'container' )
  container.appendChild(renderer.domElement);
  // console.log(container)
  //ถ้าจะเคลื่อนที่ไปตามมือที่จิ้มบนมือถือใช้นี้ไม่ได้
  // controls = new THREE.OrbitControls(camera, renderer.domElement);
  // // controls.enableKeys = false
  // // controls.enableRotate = false
  // controls.enableZoom = false
  // // Math.PI/2
  // controls.maxAzimuthAngle=0.5
  // controls.minAzimuthAngle=-0.5
  // controls.maxDistance=6
  // controls.minDistance=0
  // // controls.maxPolarAngle=1
  // // controls.minPolarAngle=-1
  // // controls.maxZoom=3
  // // controls.minZoom=1
  // controls.rotateSpeed=0.1
  // // controls.zoomSpeed=1

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
  htmlTime = document.createElement("htmlTime")
  htmlTime.style.position = 'absolute'
  htmlTime.style.top = '20px'
  htmlTime.style.textAlign = 'left'
  htmlTime.style.color = '#f747c7'
  htmlTime.style.textShadow = '0 0 4px #000'
  document.body.appendChild(htmlTime);  

  htmlScore = document.createElement("htmlScore")
  htmlScore.style.position = 'absolute'
  htmlScore.style.top = '40px'
  htmlScore.style.textAlign = 'left'
  htmlScore.style.color = '#ff1a28'
  htmlScore.style.textShadow = '0 0 4px #000'
  document.body.appendChild(htmlScore);

  htmlPlayer = document.createElement("htmlPlayer")
  htmlPlayer.style.position = 'absolute'
  htmlPlayer.style.top = '60px'
  htmlPlayer.style.textAlign = 'left'
  htmlPlayer.style.color = '#1aff3c'
  htmlPlayer.innerHTML = 'Player: '
  htmlPlayer.style.textShadow = '0 0 4px #000'
  document.body.appendChild(htmlPlayer);

  // htmlIp = document.createElement("htmlIp")
  // htmlIp.style.position = 'absolute'
  // htmlIp.style.top = '80px'
  // htmlIp.style.textAlign = 'left'
  // htmlIp.style.color = '#ffa16c'
  // htmlIp.style.textShadow = '0 0 4px #000'
  // document.body.appendChild(htmlIp);

  htmlCountry = document.createElement("htmlCountry")
  htmlCountry.style.position = 'absolute'
  htmlCountry.style.top = '80px'
  htmlCountry.style.textAlign = 'left'
  htmlCountry.style.color = '#1700ff'
  htmlCountry.style.textShadow = '0 0 4px #000'
  document.body.appendChild(htmlCountry);

  cantRec = document.createElement("cantRec")
  cantRec.style.position = 'absolute'
  cantRec.style.bottom = '90px'
  cantRec.style.textAlign = 'left'
  cantRec.style.color = '#4ef1d3'
  cantRec.style.textShadow = '0 0 4px #000'

  btn = document.createElement("button");
  btn.innerHTML = "Record Score";
  btn.setAttribute('title','Record & Reset a score')
  btn.setAttribute('class','button')
  btn.setAttribute('id','opener')
  btn.disabled = true
  btn.onclick = function(){  
    // alert('Thank you for playing');
    if(gamescore <= 0){
      console.log("Your score more than zero. Please!")
      cantRec.innerHTML = 'Your score more than zero. Please!'
      setTimeout(function(){
        cantRec.innerHTML = '';
      }, 3000);
      document.body.appendChild(cantRec);
    }else{
      // console.log("Record score = ",gamescore)
      cantRec.innerHTML = 'Record score: '+gamescore
      setTimeout(function(){
        cantRec.innerHTML = '';
      }, 3000);
      document.body.appendChild(cantRec);
      // let currentTime=new Date()
      // console.log('JS date: ',currentTime)
      let firebaseDT=new firebase.firestore.Timestamp.now()
      console.log('Firebase: ',firebaseDT)
      addData(playerIp,playerName,playerCoutry,gamescore,gametime,firebaseDT)
    }    
    // console.log('1Sc:',gamescore,'Ti:',gametime,'Na:',playerName,'Ip:',playerIp,'Cou:',playerCoutry);
    clickcount=0
    time=0
    gamescore=0
    gametime=0
    // console.log('2Sc:',gamescore,'Ti:',gametime,'Na:',playerName,'Ip:',playerIp,'Cou:',playerCoutry);
    //return false;
    
  };
  btn.onmouseover = function()  {
      this.style.backgroundColor = "blue";
  }  
  document.body.appendChild(btn);
  // console.log(btn.style)
  let linkbtn = document.createElement("a");
  linkbtn.innerHTML = "Top Charts";
  linkbtn.setAttribute('href','./indexdb.html')
  linkbtn.setAttribute('class','linkbtn')
  linkbtn.setAttribute('target','_blank')
  document.body.appendChild(linkbtn);
  // console.log(linkbtn)

  $.getJSON('https://ipapi.co/json/', function(data) {
    // console.log(JSON.stringify(data, null, 2));
      // getip.innerText = "PlayerIP: "+data.ip
      playerIp = data.ip
      // htmlIp.innerText = "Ip: "+playerIp

      playerCoutry = data.country_name
      htmlCountry.innerText = "Country: "+playerCoutry
      // console.log('cou:',playerCoutry);
  });

  let gameDialog = document.createElement("div");
  gameDialog.setAttribute('id','dialog')
  gameDialog.setAttribute('title','RandGeo')
  let gameDialogText = document.createElement("p");
  gameDialogText.innerHTML = "Thank you for playing.\nPlayer can see a chart in"
  let linkchart = document.createElement("a");
  linkchart.innerHTML = "Top Charts";
  linkchart.setAttribute('href','./indexdb.html')
  linkchart.setAttribute('target','_blank')
  gameDialog.appendChild(gameDialogText)
  gameDialog.appendChild(linkchart)
  document.body.appendChild(gameDialog);

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
  var bodyGeometry = new THREE.PlaneGeometry(2,3)
  var bodyMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000,transparent:true,opacity:0.3} )
  mouseMesh = new THREE.Mesh( bodyGeometry, bodyMaterial )
  mouseMesh.visible = false;
  mouseMesh.position.z = 1
  mouseMesh.name = 'PlaneGeom'
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
  let boxX = 1+ Math.random() * 5
  let boxY = 1+ Math.random() * 5
  let boxZ = 1+ Math.random() * 5
  let boxMass = 1
  let arrayTexture = ['tt/mcManisFs_nm.png','tt/mcMuaFS_nm.png','tt/mcMonChok_nm.png']
  let randIndex = THREE.Math.randInt(0,arrayTexture.length-1)
  //console.log('randIndex=',randIndex);
  let boxTexture = new THREE.TextureLoader().load( arrayTexture[randIndex] );
  let boxMesh = new THREE.Mesh(new THREE.BoxGeometry(boxX,boxY,boxZ,1,1,1),new THREE.MeshPhongMaterial( { color: Math.random()*0xffffff, normalMap: boxTexture} ))
  boxMesh.castShadow = true
  boxMesh.receiveShadow = true
  boxnum++
  boxMesh.name = "boxes_"+boxnum
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
  document.addEventListener('touchmove',onDocumentTouchMove,false);

  document.addEventListener('mousemove',onDocumentMousemove,false)
  window.addEventListener('mousedown',onDocumentMouseDown,false)
}

function onDocumentTouchMove( event ) {
  event.preventDefault();
  event.clientX = event.touches[0].clientX;
  event.clientY = event.touches[0].clientY;
  onDocumentMouseMove( event );
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
  mouseMesh.position.copy(wpos);
  rb88.position.copy(wpos);
}
//การจิ้มในมือถือเรียกใช้ฟังก์ชั่นคลิกในคอมพิวเตอร์
function onDocumentMouseDown(event){
  event.preventDefault()
  ballnum++
  //console.log("ballnum: ",ballnum);
  mouseCoords.x = (event.clientX/window.innerWidth)*2-1
  mouseCoords.y = -(event.clientY/window.innerHeight)*2+1
  raycaster.setFromCamera(mouseCoords,camera)
  // intersects = raycaster.intersectObjects(scene.children)
  intersectscans = raycaster.intersectObjects(boxes)
  // console.log(intersects)
  // console.log(scene.children)
  // console.log(mouseCoords)
  // console.log(camera)
  // console.log(ballshooter)
  // console.log(boxes)
  // console.log(intersectscans)
  if ( intersectscans.length>0 ){
    // collisionResults[0].object.material.opacity = 0.5
    // collisionResults[0].object.material.transparent = true
    clickcount++
  }

    // Creates a ball
    let ballMass = 1.8
    let ballRadius = 0.4
    let ballMesh = new THREE.Mesh( new THREE.SphereGeometry( ballRadius, 8, 8 ), new THREE.MeshPhongMaterial( { color: 0x111111 } ) )
    ballMesh.castShadow = true
    ballMesh.receiveShadow = true
    ballMesh.name = "ball_"+ballnum
    ballshooter.push(ballMesh)
    let ballShape = new Ammo.btSphereShape( ballRadius )
    // console.log(ballShape)
    ballShape.setMargin( margin )
    pos.copy( raycaster.ray.direction )
    pos.add( raycaster.ray.origin )
    quat.set( 0, 0, 0, 1 )
    let ballBody = createRigidBody( ballMesh, ballShape, ballMass, pos, quat )
    ballBody.setFriction( 0.5 )
    pos.copy( raycaster.ray.direction )
    pos.multiplyScalar( 30 )
    ballBody.setLinearVelocity( new Ammo.btVector3( pos.x, pos.y, pos.z ) )

  let audio = new THREE.Audio( listener );
  ballMesh.add( audio );
  let shootsound = new THREE.AudioLoader();
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

  renderer.autoClear = false;
	renderer.clear();
  renderer.render( scene, camera )

  //พิมพ์วินาทีบนหน้าเว็บ
  time += deltaTime
  gametime = time
  htmlTime.innerHTML = "Time(sec.): "+time.toFixed( 2 )
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
  let randCreate = THREE.Math.randInt(-55,55)
  if(randCreate==1){
    createBox()
    //mouseMesh.material.color.setHex( 0xaa0000 );
  }
  if(randCreate==10){
    createCan()
    htmlScore.style.color = '#c900ff'
  }
  if(randCreate==-10){
    createCone()
    htmlScore.style.color = '#00c9ff'
  }
//Collision Detection
//console.log(mouseMesh);
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
  }
  
  if(ballshooter.length>0){
    for(let i=0;i<ballshooter.length;i++){
      if(ballshooter[i].position.z<-30){
        // console.log(ballshooter[i].name,ballshooter[i].position)
        scene.remove(ballshooter[i])
      }
    }
  }

  if(boxes.length>0){
    for(let i=0;i<boxes.length;i++){
      if(boxes[i].position.z>5){
        // console.log(boxes[i].name,boxes[i].position)
        scene.remove(boxes[i])
      }
    }
  }

  //พิมพ์ค่าจำนวนที่ได้นับไว้บนหน้าเว็บ
  htmlScore.innerText = "Score: "+clickcount
  gamescore = clickcount
  // console.log('cc:',gamescore,'tt:',gametime,'name:',playerName,'country:',playerCoutry);
}
//Database
function addData(ip,name,coutry,score,playtime,datetime){
  const db=firebase.firestore();
	db.collection('Users').add({
    ip: ip,
		name: name,
    score: score,
    country: coutry,
    time: playtime,
    dati: datetime
	});
}