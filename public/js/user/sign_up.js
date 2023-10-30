
document.getElementById('aboutbtn').addEventListener('click', (e)=>{

  e.preventDefault();

  document.getElementById('about').style = 'display: flex';
  document.getElementById('signlogin').style = 'display: none';
  document.getElementById('contact').style = 'display: none';

});

document.getElementById('contactbtn').addEventListener('click', (e)=>{

  e.preventDefault();

  document.getElementById('about').style = 'display: none';
  document.getElementById('signlogin').style = 'display: none';
  document.getElementById('contact').style = 'display: flex';

});


document.addEventListener("DOMContentLoaded", function () {
    const hamburger = document.querySelector(".hamburger");
    const mobileMenu = document.querySelector(".nav-links"); 
    mobileMenu.classList.toggle("active");
    hamburger.addEventListener("click", function () {
      mobileMenu.classList.toggle("active");
      hamburger.classList.toggle("open");
    });
  });



document.getElementById('panel-sign-up').addEventListener('click', (e)=>{

    e.preventDefault();
    e.target.style = "background-color: #719efd";
    document.getElementById('panel-login').style = "background-color: #104dd1";
    document.getElementById('sign-up').style = 'display: flex';
    document.getElementById('login').style = 'display: none';
});

document.getElementById('panel-login').addEventListener('click', (e)=>{

    e.preventDefault();
    e.target.style = 'background-color: #719efd';
    document.getElementById('panel-sign-up').style = "background-color: #104dd1";
    document.getElementById('sign-up').style = 'display: none';
    document.getElementById('login').style = 'display: flex';
});

document.getElementById('panel-sign-up').click();

const userName = document.getElementById('name');
const email = document.getElementById('email');
const referralId = document.getElementById('referralId');
const phone =  document.getElementById('phone');
const password = document.getElementById('password');
const cpassword = document.getElementById('cpassword');
let side = 'left';
document.getElementById('side').addEventListener('change', (e)=>{

  side = e.target.value;
})

document.getElementById('sign_up').addEventListener('click', async (e)=>{

    e.preventDefault();

    let obj = {
        name: userName.value,
        email: email.value,
        referralId: referralId.value,
        phone: phone.value,
        password: password.value,
        side: side
    }

    console.log(obj);
    try{

        if(cpassword.value === obj.password){

            const res = await axios.post("/user/sign_up", obj);
            
            if(res.data.message === 'userExist'){
                alert('email already exist please login');
            }
            else{
                
                alert('account created successfully');

                localStorage.setItem(JSON.stringify(res.data.user));
                
                window.location.href = "/user/main";
            }      
        }
        else{

            alert('Password not Match');
        }
    }
    catch(err){

        alert("somthingwent wrong");
        console.log(err);
    }
   
});


// login

const lemail = document.getElementById("lemail"); 
const lpassword = document.getElementById("lpassword");

document.getElementById("login-btn").addEventListener("click", async (e) => {
  e.preventDefault();

  let obj = {
    email: lemail.value,
    password: lpassword.value,
  };

  try {
    let res = await axios.post("/user/login", obj);

    if (res.data.message === "userNotExist") {

      alert("User Not Exist Please SignUp");
      
    } else if (res.data.message === "passwordIncorrect") {
      alert("Password is Incorrect");
    } else if (res.data.message === "loginSuccessfully") {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      window.location.href = "/main";
    }
  } catch (err) {
    console.log(err);
  }
});
