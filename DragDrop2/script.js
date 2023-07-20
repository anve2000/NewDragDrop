const container = document.getElementsByClassName("container")[0];
const dropzones = document.getElementsByClassName("dropzone");
const numbox = document.getElementsByClassName("dropzone")[0];
const undo = document.getElementsByClassName("undo")[0];
const addButton = document.getElementsByClassName("add")[0];
const message = document.getElementsByClassName("message")[0];
const draggables = document.getElementsByClassName("draggable");
const body = document.getElementsByTagName("body")[0];

let stack = [];

let containerHeight = 30*16;
let CellGap = 20;
let containerWidth = container.clientWidth;

let boxHeight = dropzones[0].clientHeight;
let boxWidth = dropzones[0].clientWidth;

let cnt = 10;

let source = "";
let lastStateDropped = "",
  lastStateReplaced = "";

function swap(source, destination) {
  let sourcePar = source.parentElement;
  let destPar = destination.parentElement;

  source.classList.add("moving");
  destination.classList.add("moving");

  destPar.removeChild(destination);
  sourcePar.removeChild(source);
  sourcePar.append(destination);
  destPar.append(source);

  setTimeout(function () {
    source.classList.remove("moving");
    destination.classList.remove("moving");
  }, 700);
}

for (let i = 0; i < draggables.length; i++) {
  draggables[i].addEventListener("drag", (e) => {
    e.target.classList.add("dragged");
  });

  draggables[i].addEventListener("dragstart", (e) => {
    source = e.target;
    lastStateDropped = "";
    lastStateReplaced = "";
  });

  draggables[i].addEventListener("dragover", (e) => {
    e.target.classList.add("dragover");
  });

  draggables[i].addEventListener("dragend", (e) => {
    e.target.classList.remove("dragged");
  });
}

let current;

for (let i = 0; i < dropzones.length; i++) {
  dropzones[i].addEventListener("dragenter", (e) => {
    e.target.classList.add("dragenter");

    current = e.target;

    if (current.classList.contains("dropzone") === false) {
      return;
    }

    if (current === source) {
      return;
    }

    swap(source, current);
    let boxArr = document.querySelectorAll(".c");
    let array = Array.prototype.slice.call(boxArr);
    let sourceIndex = array.indexOf(source);
    let currentIndex = array.indexOf(current);
    stack.push({ sourceIndex, currentIndex });
  });

  dropzones[i].addEventListener("dragover", (e) => {
    e.preventDefault();
    e.target.classList.add("dragover");
  });

  dropzones[i].addEventListener("dragleave", (e) => {
    e.target.classList.remove("dragover", "dragenter");
    if (
      lastStateDropped === "" ||
      lastStateReplaced === "" ||
      lastStateDropped === lastStateReplaced
    )
      return;
    let val_1 = lastStateDropped.innerText;
    let val_2 = lastStateReplaced.innerText;
    message.innerText = `[${val_1}]  <--->   [${val_2}]`;
    message.style.opacity = 1;
    setTimeout(() => {
      message.style.opacity = 0;
    }, 700);
  });

  dropzones[i].addEventListener("drop", (e) => {
    e.target.classList.remove("dragover", "dragenter");
  });
}

undo.addEventListener("click", (e) => {
  if (stack.length == 0) {
    message.innerText = "no box displaced yet....";
    message.style.opacity = 1;

    setTimeout(() => {
      message.innerText = "";
      message.style.opacity = 0;
    }, 700);

    return;
  }

  let top = stack[stack.length - 1];
  let boxArr = document.querySelectorAll(".c");
  let array = Array.prototype.slice.call(boxArr);

  let first = array[top.sourceIndex];
  let second = array[top.currentIndex];

  swap(first, second);
  stack.pop();

  let val_1 = second.innerText;
  let val_2 = first.innerText;
  message.innerText = `[${val_1}] <--->  [${val_2}]`;
  message.style.opacity = 1;

  setTimeout(() => {
    message.style.opacity = 0;
  }, 700);
});

addButton.addEventListener("click", () => {

    let totalLenNeeded = Math.ceil(Number(cnt/3))*boxHeight + boxHeight + 2*CellGap;
    if(totalLenNeeded<=720){
      container.style.height = `${ Math.ceil(Number(cnt/3))*boxHeight + (Math.ceil(Number(cnt/3)))*CellGap}px`;
      for (let i = 0; i <= 2; i++) {
        let space = document.createElement("div");
        let box = document.createElement("div");
        space.classList.add('parent','p',`_${cnt + i}`);
        box.classList.add('draggable', 'dropzone','c',`_${cnt + i}`);
        box.style.backgroundColor = "pink";
        box.innerText = `${(cnt + i) * 100}`;
        space.appendChild(box);
        container.appendChild(space);
      }
    }
    else{
      // let newBoxHeigt = totalLenNeeded/(cnt/3+1);

      // for(let i=0;i<dropzones;i++){
      //   dropzones[i].firstChild.style.height=`${newBoxHeight}px`;
      //   dropzones[i].firstChild.style.backgroundColor="blue";
      // }

      // numbox.style.height = `${ newBoxHeight}px`;

    }

    
  // }

  cnt = cnt + 3;
});
