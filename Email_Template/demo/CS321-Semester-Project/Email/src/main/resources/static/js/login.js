var submit = document.getElementById("btn")
var register = document.getElementById("regBtn")


submit.addEventListener("click", submitUser)
register.addEventListener("click", addUser)

document.getElementById("exampleInputPassword").addEventListener('keydown', (event)=>{
    if (event.key === "Enter") {
        event.preventDefault()
        submitUser()
    }
})

document.getElementById("exampleInputUsername").addEventListener('keydown', (event)=>{
    if (event.key === "Enter") {
        event.preventDefault()
        submitUser()
    }
})


function checkLogin(){
    if(localStorage.getItem("ID") != null){
        window.location.href = "http://localhost:8080/template"
        window.location.replace("http://localhost:8080/template")
    }
}
checkLogin()

function submitUser(event){
    let username = document.getElementById("exampleInputUsername").value
    let password = document.getElementById("exampleInputPassword").value

    const request = new Request("http://localhost:8080/login-user", {
        headers:{
            "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({username: username, password: password})
    });

    fetch(request)
        .then(response => response.json())
        .then(data => {
            if(data.length == 0){
                document.getElementById("errorMsgTxt").innerText = "Username/password doesn't exist!"
            }
            else{
                console.log("yes")
                window.location.href = "http://localhost:8080/template"
                window.location.replace("http://localhost:8080/template")
                localStorage.setItem("ID", data[0].id)
            }
        })
        .catch(function(){

    });
}

function addUser(event){
    let user = document.getElementById("exampleInputUsername").value
    let pass = document.getElementById("exampleInputPassword").value

    const request = new Request("http://localhost:8080/add", {
        headers:{
            "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify({username: user, password: pass})
    });

    let response = fetch(request)
        .then(response => response.json())
        .then(data => {
            if(data.length == 0){
                document.getElementById("errorMsgTxt").innerText = "Username/password already exists!"
            }
            else{
                window.location.href = "http://localhost:8080/template"
                window.location.replace("http://localhost:8080/template")
                localStorage.setItem("ID", data[0].id)
            }
        })
        .catch(function(){

    });
}