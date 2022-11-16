$.get('/api/user').then(users => {
    const user = users.user;
    if(!user) return console.log(`user not found`);
    const chatForm = user.discordId;
    const avatar = user.avatar;
    const chatMessages = document.querySelector('.chat-messages');
    const roomName = 'random-chat';

    const socket = io();

    // Join chatroom
    socket.emit('joinRoom', { username: chatForm, room: roomName });

    // Get room and users
    socket.on('roomUsers', ({ roomName, user }) => {
        outputRoomName(roomName);
        // outputUsers(user);
    });

    // Message from server
    socket.on('message', (message) => {
        outputMessage(message);
    
        // Scroll down
        chatMessages.scrollTop = chatMessages.scrollHeight;
    });

    // Message submit
    $('#chat-form').submit(function (e) {
        e.preventDefault();

        // Get message text
        let msg = e.target.elements.msg.value;

        msg = msg.trim();

        if (!msg) {
            return false;
        }

        // Emit message to server
        socket.emit('chatMessage', msg);

        // Clear input
        e.target.elements.msg.value = '';
        e.target.elements.msg.focus();

        return false;
    });

    // Output message to DOM
    function outputMessage(message) {
        if(message.username == 'kartadharta'){
            const data = `<h6 class="chat-join">${message.text}</h6>`;
            $('.chat-messages').append(data);
        }
        else{
            console.log(message.username == chatForm);
            if(message.username == chatForm){
                const msg = `<span class="msg">
                        <p><span class="chat-self" id="chat-user">Me</span>: <span class="chat-msg" id="chat-msg">${message.text}</span><span class="time-right float-right">${message.time}</span></p>
                    </span>`;
                $('.chat-messages').append(msg);
            }else{
                const msg = `<span class="msg">
                        <p><span class="chat-other" id="chat-user">${message.username}</span>: <span class="chat-msg" id="chat-msg">${message.text}</span><span class="time-right float-right">${message.time}</span></p>
                    </span>`;
                $('.chat-messages').append(msg);
            }
        }
    }

    // Add room name to DOM
    function outputRoomName(room) {
        roomName.innerText = room;
    }
  
});