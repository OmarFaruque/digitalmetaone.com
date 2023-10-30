const token = localStorage.getItem("token");

document.getElementById("hide").addEventListener("click", async (e) => {
  document.getElementById("user-info").style.display = "none";
});

document.getElementById("user-info").style.display = "none"

let emailOrId = "Id";
document.getElementById("searchBy").addEventListener("change", (e) => {
  emailOrId = e.target.value;
  document.getElementById(
    "searchByValue"
  ).placeholder = `Enter User ${emailOrId}`;
});

document.getElementById("search").addEventListener("click", async (e) => {
  e.preventDefault();
  try {

    let obj = {
      emailOrId: emailOrId,
      searchBy: document.getElementById("searchByValue").value,
    };

    const res = await axios.post(
      "/admin/search-users",
      obj,
      {
        headers: { Authorization: token },
      }
    );

    if(res.data.message === 'got'){
      document.getElementById("table").innerHTML = '';
      for(let i = 0;i<res.data.users.length;i++){

        showUser(res.data.users[i]);
      }
    }
  } catch (err) {
    console.log(err);
  }
});

function showUser(user) {
  let table = document.getElementById("table");

  let tr = document.createElement("tr");

  let ID = document.createElement("td");
  ID.appendChild(document.createTextNode(user.id));

  let name = document.createElement("td");
  name.appendChild(document.createTextNode(user.name));

  let email = document.createElement("td");
  email.appendChild(document.createTextNode(user.email));

  let joiningDate = document.createElement("td");
  let date = new Date(user.createdAt);

  joiningDate.appendChild(
    document.createTextNode(
      `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`
    )
  );

  let button = document.createElement("td");
  let btn = document.createElement("button");
  btn.appendChild(document.createTextNode("Update"));
  button.appendChild(btn);

  tr.appendChild(ID);
  tr.appendChild(name);
  tr.appendChild(email);
  tr.appendChild(joiningDate);
  tr.appendChild(button);

  btn.onclick = async (e) => {
    e.preventDefault();

    console.log('checking');

    try {

      let id = document.getElementById('userId');
      id.value = user.id

      let userName = document.getElementById("name");
      userName.value = user.name;

      let email = document.getElementById("email");
      email.value = user.email;

      let phone = document.getElementById("phone");
      phone.value = user.phone;

      let password = document.getElementById("password");
      password.value = user.password;

      let active = document.getElementById("Active");
      let notActive = document.getElementById("NotActive");

      if (user.isActive === true) {
        active.checked = true;
      } else {
        notActive.checked = true;
      }

      document.getElementById("user-info").style.display = "flex"

    } catch (err) {
      console.log(err);
    }
  };

  table.appendChild(tr);
}

document.getElementById("update").addEventListener("click", async (e) => {
  e.preventDefault();

  try {

    let id = document.getElementById('userId');
    let userName = document.getElementById("name");
    let email = document.getElementById("email");
    let phone = document.getElementById("phone");
    let password = document.getElementById("password");

    let isActive = document.getElementsByName('isActive')[0].checked;

    const obj = {
      id: id.value,
      name: userName.value,
      email: email.value,
      phone: phone.value,
      password: password.value,
      isActive: isActive
    };

    const res = await axios.post(
      "/admin/update-user",
      obj,
      {
        headers: { Authorization: token },
      }
    );

    if(res.data.message === 'done'){
      alert('User Details are Updated succesfully');
    }
    else{
      alert('Some Error Occured');
    }

    document.getElementById('user-info').style = 'display: none';
  } catch (err) {
    console.log(err);
  }
  ;
});
