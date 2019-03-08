const db=firebase.firestore();
const db_player=firebase.firestore();
const table=document.querySelector('#tbresult');
const table_player=document.querySelector('#tbresult_player');
var numrow = 1
var numrowPlayer = 1
// db.collection('Users').get().then((snapshot)=>{
// db.collection('Users').where('score','>','400').get().then((snapshot)=>{
db.collection('Users').orderBy('score','desc').limit(10).get().then((snapshot)=>{
  snapshot.forEach(doc=>{
		console.log(doc.data());
		showData(doc);
	});
});
	
$.getJSON('https://ipapi.co/json/', function(data) {
	db_player.collection('Users').where('ip','==',data.ip).get().then((snapshot)=>{
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
	var cell5=row.insertCell(4);
	var cell6=row.insertCell(5);

	cell1.innerHTML=numrow++
	cell2.innerHTML=doc.data().name;
	cell3.innerHTML=doc.data().country;
	cell4.innerHTML=doc.data().score;
	cell5.innerHTML=doc.data().time;
	cell6.innerHTML=doc.data().dati.toDate();
	// cell6.innerHTML=doc.data().dati;
	
}
function showDataPlayer(doc){
	var row=table_player.insertRow(-1);
	var cell1=row.insertCell(0);
	var cell2=row.insertCell(1);
	var cell3=row.insertCell(2);
	var cell4=row.insertCell(3);
	var cell5=row.insertCell(4);
	var cell6=row.insertCell(5);
	
	cell1.innerHTML=numrowPlayer++
	cell2.innerHTML=doc.data().name;
	cell3.innerHTML=doc.data().country;
	cell4.innerHTML=doc.data().score;
	cell5.innerHTML=doc.data().time;
	cell6.innerHTML=doc.data().dati.toDate();
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