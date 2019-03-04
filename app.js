const db=firebase.firestore();
const db_player=firebase.firestore();
const table=document.querySelector('#tbresult');
const table_player=document.querySelector('#tbresult_player');
// db.collection('Users').get().then((snapshot)=>{
// db.collection('Users').where('score','>','400').get().then((snapshot)=>{
db.collection('Users').orderBy('score','desc').limit(10).get().then((snapshot)=>{
  snapshot.forEach(doc=>{
		console.log(doc.data());
		showData(doc);
	});
});
	
$.getJSON('https://ipapi.co/json/', function(data) {
	db_player.collection('Users').where('name','==',data.ip).get().then((snapshot)=>{
	snapshot.forEach(doc=>{
		console.log(doc.data());				
		showDataPlayer(doc);
		});
	});
});	
	

function showData(doc){
	var row=table.insertRow(-1);
	var cell1=row.insertCell(0);
	var cell2=row.insertCell(1);
	var cell3=row.insertCell(2);
	var cell4=row.insertCell(3);
	cell1.innerHTML=doc.data().name;
	cell2.innerHTML=doc.data().country;
	cell3.innerHTML=doc.data().score;
	cell4.innerHTML=doc.data().time;
}
function showDataPlayer(doc){
	var row=table_player.insertRow(-1);
	var cell1=row.insertCell(0);
	var cell2=row.insertCell(1);
	var cell3=row.insertCell(2);
	var cell4=row.insertCell(3);
	cell1.innerHTML=doc.data().name;
	cell2.innerHTML=doc.data().country;
	cell3.innerHTML=doc.data().score;
	cell4.innerHTML=doc.data().time;
}


//firebase realtime db
// function showDBrealtime(){
//   var firebaseRef=firebase.database().ref("User0")
//   firebaseRef.once('value').then(function(dataSnapshot){
//     console.log(dataSnapshot.val());
//   })
// }
// function insertDB(time,ip,score){
//   var firebaseRef=firebase.database().ref("User0")
//   firebaseRef.push({
//     Dt:time,
//     Ip:ip,
//     Sd2:score
//   })
// }
// function delDB(time,ip,score){
//   var firebaseRef=firebase.database().ref("User0")
//   firebaseRef.remove().then(function(){
//     console.log("Remove SS");
//   }).catch(function(error){
//   console.log('remove error',error.message);
//   })
// }