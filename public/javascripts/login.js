import {handleLogin} from "./index";


function login()
{

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    handleLogin(username, password);


    //window.open('/Principale', '_self');



}

