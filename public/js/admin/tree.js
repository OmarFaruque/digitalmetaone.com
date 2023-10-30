async function getTree() {
  console.log("get tree");
  const result = await axios.get("/admin/tree-data/11");

  const treeDOMElement = document.querySelector(".tree");

  treeDOMElement.innerHTML = "";

  console.log(result.data.data);
  treeDOMElement.appendChild(showTree(result.data.data));
}

getTree();

function showChildren(nodeChildren) {
  let children = document.createElement("div");
  children.className = "node_children";

  // console.log(nodeChildren);

  for (let i = 0; i < nodeChildren.length; i++) {
    children.appendChild(showTree(nodeChildren[i]));
  }
  return children;
}

function showTree(data) {

  let node = document.createElement("div");
  node.className = "node";

  let element = document.createElement("div");
  element.className = "node_element";

  let details = document.createElement('div');
  details.className = 'details';

  let name = document.createElement("p");
  name.innerText = data.element.name;

  let id = document.createElement("p");
  id.innerText = "Id: "+data.element.id;

  const no = data.element.direct !== null ? data.element.direct: 0
  let team = document.createElement("p");
  team.innerText = "Team: " + no;

  details.appendChild(name);
  details.appendChild(id);
  details.appendChild(team);

  element.appendChild(details);
  node.appendChild(element);

  node.appendChild(element);
  node.appendChild(showChildren(data.children));

  // node.onclick = async (e) => {
  //   e.stopPropagation();

  //   // console.log(e.target.parentElement.parentElement);

  //   if (e.target.firstElementChild === null) {
  //     const result = await axios.get(
  //       "http://localhost:4000/admin/tree-data/" + data.element.id
  //     );

  //     let parent = e.target.parentElement;
  //     parent.innerHTML = "";
  //     parent.appendChild(showTree(result.data.data));
  //   }
  // };

  return node;
}
