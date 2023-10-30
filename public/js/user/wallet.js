document.getElementById("widthdrawl-btn").addEventListener("click", (e) => {
  e.preventDefault();
  document.getElementById("form-width").style.display = "flex";
  document.getElementById("form-activate").style.display = "none";
  console.log("widthdrwal");
});

document.getElementById("activate-btn").addEventListener("click", (e) => {
  e.preventDefault();
  document.getElementById("form-activate").style.display = "flex";
  document.getElementById("form-width").style.display = "none";
  console.log("activate");
});

document.getElementById("cancel").addEventListener("click", (e) => {
  e.preventDefault();

  document.getElementById("form-width").style.display = "none";
});

document.getElementById("cancel-active").addEventListener("click", (e) => {
  e.preventDefault();
  document.getElementById("form-activate").style.display = "none";
});

const token = localStorage.getItem("token");

async function getwallet() {
  try {
    let res = await axios.get("/main/wallet-info", {
      headers: { Authorization: token },
    });
    if (res.data.message === "got") {
      return res.data.wallet;
    } else {
      alert("Somthing Went Wrong");
    }
  } catch (err) {
    console.log(err);
  }
}

window.addEventListener("DOMContentLoaded", async () => {
  try {
    const wallet = await getwallet();

    document.getElementById("available").innerText = wallet.available + ".00 $";
    document.getElementById("widthdrawl").innerText =
      wallet.widthdrawl + ".00 $";
  } catch (err) {
    console.log(err);
  }
});

document.getElementById("widthdraw").addEventListener("click", async (e) => {
  e.preventDefault();

  try {
    let name = document.getElementById("name").value;
    let amount = document.getElementById("amount").value;
    let cryptoId = document.getElementById("cryptoId").value;


    let obj = {
      name: name,
      amount: amount,
      cryptoId: cryptoId
    };

    const res = await axios.post(
      "/widthdrawl-request",
      obj,
      {
        headers: { Authorization: token },
      }
    );

    const request = res.data.request;

    if (res.data.message === "got") {
      alert(
        `${request.name} Your Request for ${request.amount} has Been Placed`
      );

      document.getElementById("form-widthdrawl").style.display = "none";

    }
  } catch (err) {
    console.log(err);
  }
});

async function getHistory() {
  try {
    const res = await axios.get(
      "/main/widthdrawl-history",
      {
        headers: { Authorization: token },
      }
    );

    if (res.data.message === "got") {
      const history = res.data.history;
      let table = document.getElementById("table");
      table.innerHTML = "";

      for (let index = 0; index < history.length; index++) {
        showHistory(history[index], table);
      }
    }
  } catch (err) {
    console.log(err);
  }
}

getHistory();

function showHistory(member, table) {
  let tr = document.createElement("tr");

  let id = document.createElement("td");
  id.appendChild(document.createTextNode(member.id));

  let amount = document.createElement("td");
  amount.appendChild(document.createTextNode(member.amount + " .00 $"));

  let joiningDate = document.createElement("td");
  let date = new Date(member.createdAt);
  joiningDate.appendChild(
    document.createTextNode(
      `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`
    )
  );

  let status = document.createElement("td");
  status.appendChild(document.createTextNode(member.status));

  tr.appendChild(id);
  tr.appendChild(joiningDate);
  tr.appendChild(status);
  tr.appendChild(amount);


  table.appendChild(tr);
}


// activate frind id


document.getElementById('activate').addEventListener('click', async(e)=>{

  e.preventDefault();

  try{

    const obj = {
      friendId: document.getElementById('friendId').value
    }

    console.log(obj);

    const res = await axios.post(
      "/main/activate-friend", obj,
      {
        headers: { Authorization: token },
      }
    );

    const message = res.data.message;
    
    if(message === 'done'){
      alert('Activated Successfully');
    }
    else if(message === 'notenough'){

      alert('Not Enough Money');
    }
    else if(message === 'notuser'){
      alert('Please Enter A Valid User ID');
    }
  }
  catch(err){
    console.log(err);
  }
})