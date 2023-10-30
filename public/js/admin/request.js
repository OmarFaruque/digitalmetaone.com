const token = localStorage.getItem("token");

document.getElementById("hide").addEventListener("click", async (e) => {
  document.getElementById("request-info").style.display = "none";
});

async function getJoiningRequests() {
  try {
    let res = await axios.get("http://localhost:4000/admin/joining-requests", {
      headers: { Authorization: token },
    });

    if (res.data.message === "got") {
      return res.data.requests;
    }
  } catch (err) {
    console.log(err);
  }
}

async function getWidthdrawlRequests() {
  try {
    let res = await axios.get(
      "http://localhost:4000/admin/widthdrawl-requests",
      {
        headers: { Authorization: token },
      }
    );

    if (res.data.message === "got") {
      return res.data.requests;
    }
  } catch (err) {
    console.log(err);
  }
}

window.addEventListener("DOMContentLoaded", async () => {
  try {
    showRequests();
  } catch (err) {
    console.log(err);
  }
});

function showRequest(request, type) {
  let newMembers = document.getElementById("table");

  let tr = document.createElement("tr");

  let no = document.createElement("td");
  no.appendChild(document.createTextNode(request.userId));

  let amount = document.createElement("td");
  amount.appendChild(document.createTextNode(request.amount));

  let transactionId = document.createElement("td");

  let name = document.createElement("td");
  name.appendChild(document.createTextNode(request.name));

  let requestDate = document.createElement("td");
  let date = new Date(request.createdAt);

  requestDate.appendChild(
    document.createTextNode(
      `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`
    )
  );

  let button = document.createElement("td");
  let btn = document.createElement("button");
  btn.appendChild(document.createTextNode("Check"));
  button.appendChild(btn);

  tr.appendChild(no);
  tr.appendChild(name);
  tr.appendChild(amount);
  tr.appendChild(requestDate);

  if (type === "joining") {
    transactionId.appendChild(document.createTextNode(request.transactionId));
  } else {
    transactionId.appendChild(document.createTextNode(request.cryptoId));
  }

  tr.appendChild(transactionId);
  tr.appendChild(button);

  btn.onclick = async (e) => {
    let userId = document.getElementById("id");
    userId.innerText = "User Id: M" + request.userId;

    let name = document.getElementById("requestName");
    name.innerText = "User Name: " + request.name;

    let amount = document.getElementById("amount");
    amount.innerText = "Amount: " + request.amount;

    let transactionId = document.getElementById("transactionId");

    let date = document.getElementById("Date");
    date.innerText = "Request Date: " + request.createdAt;

    document.getElementById("request-info").style.display = "flex";

    if (type === "joining") {
      transactionId.innerText = "Transaction Id: " + request.transactionId;

      document.getElementById("image").style.visibility = "visible";
      document.getElementById(
        "image"
      ).src = `/main/get-image/${request.id}`;
    } else {
      transactionId.innerText = "Crypto Id: " + request.cryptoId;
      document.getElementById("image").style.visibility = "hidden";
    }

    document.getElementById("approve").addEventListener("click", async () => {
      await updateRequest(request, "APPROVED", type);
      newMembers.removeChild(e.target.parentElement.parentElement);
      document.getElementById("request-info").style.display = "none";

    });

    document.getElementById("cancel").addEventListener("click", async () => {
      await updateRequest(request, "CANCELED", type);
      newMembers.removeChild(e.target.parentElement.parentElement);
      document.getElementById("request-info").style.display = "none";

    });
  };

  newMembers.appendChild(tr);
}

async function updateRequest(request, status, type) {
  try {
    let obj = {
      id: request.id,
      status: status,
    };

    let res;

    if (type === "joining") {
      res = await axios.put(
        "/admin/joining-request",
        obj,
        {
          headers: { Authorization: token },
        }
      );
    } else {
      res = await axios.put(
        "/admin/widthdrawl-request",
        obj,
        {
          headers: { Authorization: token },
        }
      );
    }

    if (res.data.message === "approved") {
      alert(`Request is Approved For Id ${request.userId}`);

    } else {
      alert(`Request is Canceled For Id ${request.userId}`);
    }


  } catch (err) {
    console.log(err);
  }
}

// showing requests

function showRequests() {
  let joiningBtn = document.getElementById("joining-requests");
  let widthdrawlBtn = document.getElementById("widthdrawl-requests");

  let joining = document.getElementById("joining");
  let widthdrawl = document.getElementById("widthdrawl");

  joiningBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    e.target.style = "background-color: #719efd";

    widthdrawl.style.display = "none";
    joining.style.display = "revert";

    widthdrawlBtn.style = "background-color: #104dd1";

    const requests = await getJoiningRequests();

    document.getElementById("table").innerHTML = "";

    for (let i = 0; i < requests.length; i++) {
      showRequest(requests[i], "joining");
    }
  });

  widthdrawlBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    e.target.style = "background-color: #719efd";

    joining.style.display = "none";
    widthdrawl.style.display = "revert";

    joiningBtn.style = "background-color: #104dd1";

    const requests = await getWidthdrawlRequests();

    document.getElementById("table").innerHTML = "";

    for (let i = 0; i < requests.length; i++) {
      showRequest(requests[i], "widthdrawl");
    }
  });

  joiningBtn.click();
}
