import "./index.css";


const nameInput = document.getElementById('nameInput') as HTMLInputElement
const roomSelect = document.getElementById('roomSelect') as HTMLSelectElement
const startBtn = document.getElementById('startBtn') as HTMLButtonElement

startBtn.addEventListener('click', () => {
  const userName = nameInput.value
  const roomName = roomSelect.value
  console.log("userName", userName);
  console.log("roomName", roomName);
  
  
  location.href = `/chatRoom/chatRoom.html?user_name=${userName}&room_name=${roomName}`
})
