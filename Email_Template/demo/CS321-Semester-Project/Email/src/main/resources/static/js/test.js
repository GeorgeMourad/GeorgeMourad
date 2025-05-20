var button1 = document.querySelector(".get-btn")
var button2 = document.querySelector(".del-btn")
var button3 = document.querySelector(".add-btn")
var button4 = document.querySelector(".addTemp")
var login = document.getElementById("login")
var tBtn = document.getElementById("delTBtn")

button1.addEventListener("click", getUsers)
button2.addEventListener("click", delUser)
button3.addEventListener("click", addUser)
button4.addEventListener("click", createTemplate)
login.addEventListener("click", loginUser)
tBtn.addEventListener("click", deleteTemplate)

document.getElementById("currID").innerText = "ID: " + localStorage.getItem("ID")

function loginUser(event){

    let user = document.getElementById("user").value
    let pass = document.getElementById("pass").value

    const request = new Request("http://localhost:8080/login-user", {
        headers:{
            "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({username: user, password: pass})
    });

    fetch(request)
        .then(response => response.json())
        .then(data => {
            if(data.length == 0){
                console.log("Username/password doesn't exist!")
            }
            else{
                console.log("yes")
                document.getElementById("currID").innerText = "ID: " + data[0].id
            }
        })
        .catch(function(){

        });

}

userList();
function userList(){
    let userlist = document.getElementById("userList")
    const request = new Request("http://localhost:8080/get-all-users", {
        method: "GET",
    });

    let response = fetch(request)
        .then(response => response.json())
        .then(data => {
            data.forEach((user) => {
                userlist.innerHTML += "<li>" + user.username + " " + user.password + "</li>"
            })
        })
        .catch(function(){

        });
}

function getUsers(event){

    const request = new Request("http://localhost:8080/get-all-users", {
        method: "GET",
    });

    let response = fetch(request)
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(function(){

        });

    
}

function delUser(event){
    let user = document.getElementById("delUID").value

    const request = new Request("http://localhost:8080/remove/" + user, {
        method: "DELETE",
    });

    let response = fetch(request)
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(function(){

    });
}

function addUser(event){
    let user = document.getElementById("username").value
    let pass = document.getElementById("password").value

    const request = new Request("http://localhost:8080/add", {
        headers:{
            "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({username: user, password: pass})
    });

    let response = fetch(request)
        .then(response => response.json)
        .then(data => {
            
        })
        .catch(function(){

    });
}

function createTemplate(){
    let header = document.getElementById("header").value
    let action = document.getElementById("action").value
    let closing = document.getElementById("closing").value
    let signature = document.getElementById("signature").value
    let uid = document.getElementById("currID").innerText.substring(4)

    const request = new Request("http://localhost:8080/create", {
        headers:{
            "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({header: header, action: action, closing: closing, signature: signature, uid: uid})
    });

    let response = fetch(request)
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(function(){

    });
}

var logoutB = document.getElementById("logout")

logoutB.addEventListener("click", logout)

function logout(){
    localStorage.removeItem("ID")
}

function deleteTemplate(){
    let templateID = document.getElementById("delTID").value
    const request = new Request("http://localhost:8080/delete/" + templateID, {
        method: "DELETE",
    });

    let response = fetch(request)
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(function(){

        });
}

