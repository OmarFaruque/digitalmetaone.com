const token = localStorage.getItem('token');

window.addEventListener('DOMContentLoaded', async ()=>{

    const res = await axios.get('/admin/company-info', { headers: { Authorization: token}});

    const members = res.data.info;

    if(res.data.message === 'got'){

    // members
        document.getElementById("green_member_in_lifetime").innerText = members.allActive + " ";
        document.getElementById("green_member_in_this_month").innerText = members.allActiveInMonth + " ";
        document.getElementById("red_member_in_lifetime").innerText = members.notActive + " ";
        document.getElementById("red_member_in_this_month").innerText = members.notActiveInMonth + " ";

    // earning
        document.getElementById("earning_in_lifetime").innerText =  + '.00₹';
        document.getElementById("earning_in_this_month").innerText =  + '.00₹';

    }
    else{
        alert('Something Went Wrong ! Please Refresh')
    }
    console.log(res.data);

    const result = await axios.get('/admin/members-info',{ headers: { Authorization: token}});

    const message = result.data.message;
    const newMembers = result.data.newMembers

    if(message === 'got'){

        for(let i = 0;i<newMembers.length;i++){
            showMember(newMembers[i], i+1);
        }
    }

});

function showMember(member, index){

    let newMembers = document.getElementById('table');

    let tr = document.createElement('tr');

    let no = document.createElement('td');
    no.appendChild(document.createTextNode(index));

    let name = document.createElement('td');
    name.appendChild(document.createTextNode(member.name));

    let email = document.createElement('td');
    email.appendChild(document.createTextNode(member.email));

    let joiningDate = document.createElement('td');

    let date = new Date(member.createdAt);
    joiningDate.appendChild(document.createTextNode(`${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`));

    let plan = document.createElement('td');
    plan.appendChild(document.createTextNode(member.planType));

    tr.appendChild(no);
    tr.appendChild(name);
    tr.appendChild(email);
    tr.appendChild(joiningDate);
    tr.appendChild(plan);

    if(member.planType === null){
        tr.style.background = '#ff7474';
    }

    newMembers.appendChild(tr);
}