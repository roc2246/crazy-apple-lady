export function createMssg(mssg) {
    const tag = document.createElement("h4");
    tag.classList.add("confirmation__mssg");
    tag.textContent = mssg;
  
    const confirmBox = document.querySelector(".confirmation");
    confirmBox.innerText = " ";
    confirmBox.append(tag);
  }