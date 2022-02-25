import "./index.css";
import { io } from "socket.io-client";
import { UserData } from "@/service/UserService";

type ChatMsg = { userData: UserData; msg: string; time: number };

const url = new URL(location.href);
const userName = url.searchParams.get("user_name");
const roomName = url.searchParams.get("room_name");

if (!userName || !roomName) {
  location.href = "/main/main.html";
}

const clientIo = io();

//加入房間
clientIo.emit("join", { userName, roomName });

const textInput = document.getElementById("textInput") as HTMLInputElement;
const submitBtn = document.getElementById("submitBtn") as HTMLButtonElement;
const chatBoard = document.getElementById("chatBoard") as HTMLDivElement;
const headerRoomName = document.getElementById(
  "headerRoomName"
) as HTMLParagraphElement;
const backBtn = document.getElementById("backBtn") as HTMLButtonElement;

headerRoomName.innerText = roomName || " - ";

let userID = "";

const selfMsg = (time: string, data: ChatMsg) => {
  return `
<p class="text-xs text-gray-700 mr-4">${time}</p>
<div>
  <p class="text-xs text-white mb-1 text-right">${data.userData.userName}</p>
  <p
    class="mx-w-[50%] break-all bg-white px-4 py-2 rounded-bl-full rounded-br-full rounded-tl-full"
  >
    ${data.msg}
  </p>
</div>
`;
};

const otherMsg = (time: string, data: ChatMsg) => {
  return `
    <div>
    <p class="text-xs text-gray-700 mb-1">${data.userData.userName}</p>
    <p
      class="mx-w-[50%] break-all bg-gray-800 px-4 py-2 rounded-tr-full rounded-br-full rounded-tl-full text-white"
    >
      ${data.msg}
    </p>
  </div>

  <p class="text-xs text-gray-700 ml-4">${time}</p>
  `;
};

const msgHandler = (data: ChatMsg) => {
  const date = new Date(data.time);
  const time = `${date.getHours()}:${date.getMinutes()}`;
  const divBox = document.createElement("div");
  divBox.classList.add("flex", "mb-4", "items-end");
  if (data.userData.id === userID) {
    divBox.classList.add("justify-end");
    divBox.innerHTML = selfMsg(time, data);
  } else {
    divBox.classList.add("justify-start");
    divBox.innerHTML = otherMsg(time, data);
  }
  chatBoard.appendChild(divBox);
  textInput.value = "";
  //收到新訊息後滑到最底部
  chatBoard.scrollTop = chatBoard.scrollHeight;
};

//系統訊息
function roomMsgHandler(msg: string) {
  const divBox = document.createElement("div");
  divBox.classList.add("flex", "justify-center", "mb-4", "items-center");
  divBox.innerHTML = `
    <p class="text-gray-700 text-sm">${msg}</p>
    `;
  chatBoard.append(divBox);
  chatBoard.scrollTop = chatBoard.scrollHeight;
}

//發送訊息
submitBtn.addEventListener("click", () => {
  const textValue = textInput.value;
  // chat event
  clientIo.emit("chat", textValue);
});

backBtn.addEventListener("click", () => {
  location.href = "/main/main.html";
});

//加入房間
clientIo.on("join", (msg) => {
  roomMsgHandler(msg);
});

//收到訊息
clientIo.on("chat", (data: ChatMsg) => {
  msgHandler(data);
});

//房間離開
clientIo.on("leave", (msg) => {
  roomMsgHandler(msg);
});

//建立用戶id
clientIo.on("userID", (id) => {
  userID = id;
});
