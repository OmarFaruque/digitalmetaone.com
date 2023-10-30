const user = JSON.parse(localStorage.getItem("user"));

const token = localStorage.getItem("token");

if(user.planType === null){
  document.getElementById("planType").innerText = 'Not Active';
}
else{
  document.getElementById("planType").innerText = user.planType;
}

document.getElementById("linkLeft").innerText = "Referal Id: "+`USERM${user.id}`;

window.addEventListener("DOMContentLoaded", async () => {
  try {
    document.getElementById("image").src =
      "/user/image/" + user.id;

    const res = await axios.get("/user/get-info", {
      headers: { Authorization: token },
    });

    if (res.data.message === "got") {
      let user = res.data.info;

      document.getElementById("user-name").innerText = "Name: " + user.name;
      document.getElementById("email").innerText = "Email: " + user.email;
      document.getElementById("phoneNo").innerText = "Mob. No.: " + user.phone;
      document.getElementById("joiningDate").innerText =
        "Joining Date: " + user.joiningDate;
    }
  } catch (err) {
    console.log(err);
  }
});

// changing password

let getFormBtn = document.getElementById("changePassword");

getFormBtn.addEventListener("click", (e) => {
  e.preventDefault();

  let form = document.getElementById("change-form");

  if (form.style.display === "none") {
    form.style.display = "flex";
  } else {
    form.style.display = "none";
  }
});

getFormBtn.click();

document.getElementById("cancel").addEventListener("click", (e) => {
  e.preventDefault();

  document.getElementById("change-form").style.display = "none";
});

document.getElementById("change").addEventListener("click", async (e) => {
  e.preventDefault();

  try {
    let oldPassword = document.getElementById("oldPassword").value;
    let newPassword = document.getElementById("newPassword").value;
    let CnewPassword = document.getElementById("cpassword").value;


    let obj = {
      oldPassword: oldPassword,
      newPassword: newPassword,
    };

    if(CnewPassword === newPassword){

      const res = await axios.post(
        "/user/change-password",
        obj,
        { headers: { Authorization: token } }
        );
        
        const message = res.data.message;
        
        if (message === "got") {
          alert("Password Changed Successfully!");
          getFormBtn.click();
          // localStorage.setItem("token", res.data.token);
        } else if (message === "wrong") {
          alert("Your Old Password is Wrong! Please Enter a Valid Password");
        } else {
          alert("Something Went Wrong! Please Try Again");
        }
      }
      else{

        alert('Password Not Match');
      }
  } catch (err) {
    console.log(err);
  }
});

let userPhoto;
document.getElementById("imageUpload").addEventListener("change", (e) => {
  userPhoto = e.target.files[0];
});

document.getElementById("upload").addEventListener("click", async (e) => {
  e.preventDefault();

  try {
    const formData = new FormData();

    formData.append("file", userPhoto);

    const res = await axios.post("/user/image", formData, {
      headers: { Authorization: token, "Content-Type": "multipart/form-data" },
    });

    if (res.data.message === "got") {
      window.location = "/page/user";
    }
  } catch (err) {
    console.log(err);
  }
});

// updating plan

document.getElementById("upgrade").addEventListener("click", async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post(
      "/user/upgrade",
      {},
      { headers: { Authorization: token } }
    );

    const message = res.data.message;

    if (message === "done") {
      alert("Your plan upgraded successfully");
    } else if (message === "notenough") {
      alert("You do not have enough money");
    } else if (message === "royal") {
      alert("You have best plan");
    } else {
      alert("You do not have active plan");
    }
  } catch (err) {
    console.log(err);
  }
});
