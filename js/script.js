const myID = document.querySelector('.myID')
const myName = document.querySelector('.myName')
const sendMessageBttn = document.getElementById('button')
const input = document.getElementById('input')
const chat = document.querySelector('.chat')
const inputBox = document.querySelector('.inputBox')
const login = document.getElementById('entrar')

const maxCaracters = 100
document.getElementById("limpar").addEventListener('click', () => {
    localStorage.clear();
})

// -----------------------------------------------------------------
const myUser = {
    'userID': '',
    'userName': '',
}

const getRandomID = () => {
    return parseInt(Math.random() * 8999 + 1000);
}

let websocket

const getTime = () => {
    let date = new Date()
    return date.getHours() + ':' + date.getMinutes()
}

const logIn = () => {
    const tela = document.getElementById('login')
    const user = document.getElementById('cadUser').value

    if (user.length < 3) {
        const errorMessage = document.getElementById('errorMessage')
        errorMessage.innerHTML = 'Necessário ter no mínimo 3 caracteres'

        setInterval(()=>{
            errorMessage.innerHTML = ''
        }, 3000)
        return
    }
    
    myUser.userName = user
    localStorage.setItem('userName', myUser.userName)
    myUser.userID = myUser.userName.split(' ')[0].toLowerCase() + '#' + getRandomID()
    localStorage.setItem('userID', myUser.userID)
    
    myID.innerHTML = myUser.userID
    myName.innerHTML = myUser.userName

    tela.style.display = 'none'

    
    // WebSocket
    websocket = new WebSocket('wss://cchat-backend-i2rk.onrender.com')
    websocket.onmessage = processMessage
}

const processMessage = ({data}) => {

    const _data = JSON.parse(data)

    if (_data.id == myUser.userID)
        sendMessage(_data)
    else
        receiveMessage(_data)
    goToBottom()
}

const sendMessage = (content) => {

    // Div pai
    const div = document.createElement('div')

    // Div onde ficara as informacoes da mensagem
    const messageBox = document.createElement('div')

    // Span onde ficara o ID do usuario
    const spanID = document.createElement('span')

    // Span onde ficara a mensagem
    const spanMessage = document.createElement('span')

    // Span onde ficara a hora
    const spanTime = document.createElement('span')

    // Seta as classes
    div.classList.add('messageBox')
    messageBox.classList.add('sendMessage')
    messageBox.classList.add('message')
    spanID.classList.add('myID')
    spanID.classList.add('ID')
    spanMessage.classList.add('messageContent')
    spanTime.classList.add('time')

    // Seta os textos
    spanID.innerHTML = content.id
    spanMessage.innerHTML = content.message
    spanTime.innerHTML = getTime()

    messageBox.appendChild(spanID)
    messageBox.appendChild(spanMessage)
    messageBox.appendChild(spanTime)

    div.appendChild(messageBox)

    chat.appendChild(div)
}

const receiveMessage = (content) => {7
    // Div pai
    const div = document.createElement('div')

    // Div onde ficara as informacoes da mensagem
    const messageBox = document.createElement('div')

    // Span onde ficara o ID do usuario
    const spanID = document.createElement('span')

    // Div onde ficara a imagem do usuario
    const divImage = document.createElement('div')

    // Span onde ficara a mensagem
    const spanMessage = document.createElement('span')

    // Span onde ficara a hora
    const spanTime = document.createElement('span')

    // Seta as classes
    div.classList.add('messageBox')
    messageBox.classList.add('receivedMessage')
    divImage.classList.add('receivedImage')
    messageBox.classList.add('message')
    spanID.classList.add('personID')
    spanID.classList.add('ID')
    spanMessage.classList.add('messageContent')
    spanTime.classList.add('time')

    // Seta os textos
    spanID.innerHTML = content.id
    spanMessage.innerHTML = content.message
    spanTime.innerHTML = getTime()

    messageBox.appendChild(spanID)
    messageBox.appendChild(spanMessage)
    messageBox.appendChild(spanTime)

    div.appendChild(divImage)
    div.appendChild(messageBox)

    chat.appendChild(div)
}

const goToBottom = () => chat.scrollTop = chat.scrollHeight

const checkSizeMessage = () => (input.value.length > 0 && input.value.length <= maxCaracters ? true : false)

login.addEventListener('click', logIn)

sendMessageBttn.addEventListener('click', () => {
    const _data = {
        'id': myUser.userID,
        'message': input.value
    }

    websocket.send(JSON.stringify(_data))
})

goToBottom()
