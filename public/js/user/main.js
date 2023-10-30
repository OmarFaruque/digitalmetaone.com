const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

let before = document.getElementById("before");
let after = document.getElementById("after");

document.getElementById("upload-recipt").addEventListener("click", (e) => {
  e.preventDefault();
  document.getElementById("upload-recipt-form").style.display = "block";
});

document
  .getElementById("cancel-upload")
  .addEventListener("click", async (e) => {
    document.getElementById("upload-recipt-form").style.display = "none";
  });

if (user.planType === null) {
  after.style.display = "none";
  before.style.display = "flex";
} else {
  after.style.display = "block";
  before.style.display = "none";
  showUserData();
}

async function getEarning() {
  try {
    let res = await axios.get("/main/earning", {
      headers: { Authorization: token },
    });

    if (res.data.message === "got") {
      return res.data.earning;
    } else {
      alert("Somthing Went Wrong");
    }
  } catch (err) {
    console.log(err);
  }
}


// showing user details

document.getElementById('id').innerText = "User Id: " + user.id;
document.getElementById('user-name').innerText = "Name: " + user.name;
document.getElementById('Plan-type').innerText = "Acive Level: " + user.planType;
document.getElementById('image').src = `/main/user-image/${user.id}`;



async function showUserData() {
  // earnings
  let total = document.getElementById("total");
  let today = document.getElementById("today");
  let direct = document.getElementById("direct");
  let level = document.getElementById("level");

  const earning = await getEarning();

  total.innerText = earning.total.toFixed(2);
  today.innerText = earning.today.toFixed(2);
  direct.innerText = earning.direct.toFixed(2);
  level.innerText = earning.level.toFixed(2);
}

// uploading recipt

let reciptPhoto;
document.getElementById("recipt-photo").addEventListener("change", (e) => {
  reciptPhoto = e.target.files[0];

  console.log(reciptPhoto);
});

document.getElementById("upload").addEventListener("click", async (e) => {
  e.preventDefault();

  try {
    let name = document.getElementById("name").value;
    let amount = document.getElementById("amount").value;
    let transactionId = document.getElementById("transactionId").value;

    let obj = {
      name: name,
      amount: amount,
      transactionId: transactionId,
    };

    const formData = new FormData();

    formData.append("file", reciptPhoto);
    formData.append("info", JSON.stringify(obj));

    const res = await axios.post(
      "/main/joining-request",
      formData,
      {
        headers: {
          Authorization: token,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (res.data.message === "got") {
      alert("Recipt is Uploaded successfully");
      document.getElementById("upload-recipt-form").style.display = "none";
    }
  } catch (err) {
    console.log(err);
  }
});

// boost board

document.getElementById("boost-income").addEventListener("click", async (e) => {
  e.preventDefault();
  try {
    const res = await axios.get("/main/join-boost-board", {
      headers: { Authorization: token },
    });

    console.log(res.data.message);
  } catch (err) {
    console.log(err);
  }
});
