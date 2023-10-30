const token = localStorage.getItem("token");

const user = JSON.parse(localStorage.getItem("user"));

async function getMembers() {
  try {
    let res = await axios.get("/main/members", {
      headers: { Authorization: token },
    });

    if (res.data.message === "got") {
      return res.data.members;
    } else {
      alert("Somthing Went Wrong");
    }
  } catch (err) {
    console.log(err);
  }
}

async function showUserData() {
  // members

  let totalMembes = document.getElementById("totalTeam");
  let directReffral = document.getElementById("directReffral");
  let activeMembers = document.getElementById("activeMembers");
  let notActive = document.getElementById("notActive");

  const members = await getMembers();

  const activeTeam = members.team.filter((member) => member.planType != null);

  const notActiveTeam = members.team.filter(
    (member) => member.planType === null
  );

  totalMembes.innerText = members.team.length;
  directReffral.innerText = members.directTeam.length;
  activeMembers.innerText = activeTeam.length;
  notActive.innerText = notActiveTeam.length;

  showTeam(members.team, activeTeam, members.directTeam);
}

window.addEventListener('DOMContentLoaded', async()=>{
  await showUserData();
});


function showTeam(total, active, direct) {
  let totalTeamBtn = document.getElementById("totalTeamBtn");
  let activeTeamBtn = document.getElementById("activeTeamBtn");
  let directTeamBtn = document.getElementById("directTeamBtn");

  totalTeamBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.target.style = "background-color: #719efd";

    activeTeamBtn.style = "background-color: #104dd1";
    directTeamBtn.style = "background-color: #104dd1";

    show(total);
  });

  activeTeamBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.target.style = "background-color: #719efd";

    directTeamBtn.style = "background-color: #104dd1";
    totalTeamBtn.style = "background-color: #104dd1";

    show(active);
  });

  directTeamBtn.addEventListener("click", (e) => {
    e.preventDefault();
    e.target.style = "background-color: #719efd";

    activeTeamBtn.style = "background-color: #104dd1";
    totalTeamBtn.style = "background-color: #104dd1";

    show(direct);
  });


  function show(team) {
    let table = document.getElementById("table");
    table.innerHTML = "";
    for (let index = 0; index < team.length; index++) {

      showMember(team[index]);
    }
  }

  totalTeamBtn.click();
}

function showMember(member) {

  let table = document.getElementById("table");

  let tr = document.createElement("tr");

  let no = document.createElement("td");
  no.appendChild(document.createTextNode(member.id));

  let name = document.createElement("td");
  name.appendChild(document.createTextNode(member.name));

  let joiningDate = document.createElement("td");

  let date = new Date(member.createdAt);
  joiningDate.appendChild(
    document.createTextNode(
      `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`
    )
  );

  let plan = document.createElement("td");
  plan.appendChild(document.createTextNode(member.planType));

  tr.appendChild(no);
  tr.appendChild(name);
  tr.appendChild(joiningDate);
  tr.appendChild(plan);

  table.appendChild(tr);
}