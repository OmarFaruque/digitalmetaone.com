let email = document.getElementById("email"); 
let password = document.getElementById("password");

document.getElementById("login").addEventListener("click", async (e) => {
  e.preventDefault();

  let obj = {
    email: email.value,
    password: password.value,
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

// document.getElementById("forgot_password").addEventListener("click", () => {
//   window.location.href = "/forgot-password";
// });
