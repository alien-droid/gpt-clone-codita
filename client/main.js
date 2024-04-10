import bot from './assets/bot.svg';
import user from './assets/user.svg';

const form = document.querySelector('form')
const container = document.querySelector('#chat_container')

let loadInterval

function loader(element) {
  element.textContent = ''
  loadInterval = setInterval(() => {
    element.textContent += '.'
    if (element.textContent.length > 4) {
      element.textContent = ''
    }
  }, 300)
}

function typingText(element, text) {
  let index = 0

  let interval = setInterval(() => {
    element.textContent += text.charAt(index)
    index++
    if (index >= text.length) {
      clearInterval(interval)
    }
  }, 20)
}

function generateID() {
  const timestamp = Date.now()
  const hexaString = Math.random().toString(16)
  return `id-${timestamp}-${hexaString}`
}

function chatWindow(isAi, value, id) {
  return (
    `
    <div class="wrapper ${isAi && 'ai'}">
      <div class="chat">
        <div class="profile">
          <img src="${isAi ? bot : user}" alt="${isAi ? 'bot' : 'user'}">
        </div>
        <div class="message" id="${id}">${value}</div>
      </div>
    </div>
    `
  )
}

const handleSubmit = async (e) => {
  e.preventDefault()

  const data = new FormData(form)

  container.innerHTML += chatWindow(false, data.get('prompt')) // user
  form.reset()

  // bot
  const id = generateID()
  container.innerHTML += chatWindow(true, " ", id)
  container.scrollTop = container.scrollHeight
  const messageDiv = document.getElementById(id)
  loader(messageDiv)

  // server call
  const response = await fetch('https://gpt-clone-codita.onrender.com/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: data.get('prompt'),
    }),
  })
  clearInterval(loadInterval)
  messageDiv.textContent = ''

  if (response.ok) {
    const data = await response.json()
    const trimedData = data.bot.trim()
    console.log(trimedData)
    typingText(messageDiv, trimedData)
  }
  else {
    const text = await response.text()
    messageDiv.textContent = 'Something went wrong ... please try again.'
    alert(text)
  }
}

form.addEventListener('submit', handleSubmit)
form.addEventListener('keyup', (e) => {
  if (e.key === "Enter")
    handleSubmit(e)
})