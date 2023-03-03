(function () {
    const server = 'http://127.0.0.1:3000'
    const socket = io(server);

    socket.on('notification', (data) => {
        console.log('Message depuis le seveur:', data);
    }
    )
    window.onload = myFunction();
    window.onload = fetchAndRefesh();
    const submitBtn = document.getElementById('chat-btn');
    function myFunction() {
        let username = document.getElementById("username").textContent;
        
        if (username == null || username ==""){
            let person = prompt("Please enter your name:");
            if (person == null || person == "") {
              myFunction();
            } else {
                // console.log(person);
              username = person;
            }
            document.getElementById("username").innerHTML = username;
            socket.emit('Connect_User',(username));
        }
      }
      socket.on('Connect_User',async (session)=>{
        let resp = await fetch('http://localhost:3000/chat');
        let data = await resp.json();

        Object.entries(session).forEach((user)=>{
            console.log(user[1]["name"]);
            let username = user[1]["name"];
            let member_list = document.querySelector('.member-list');
            let li = document.createElement('li');
            let count = 0;
            for (let i = 0; i < data.length; i++) {
                if (username == data[i].username){
                    count++;
                  }
              }
            li.textContent = username+" msg:"+count;
            member_list.appendChild(li);
            let br = document.createElement('br');
            member_list.appendChild(br);
        })
      })
      socket.on('Refresh',()=>{
        // console.log("refresh");
        fetchAndRefesh();
      })
    submitBtn.addEventListener('click', function() {
        let username = document.getElementById("username");
        let message = document.getElementById("chat-input");
        const today = new Date();
        const options = { timeZone: 'Europe/Paris', hour: 'numeric', minute: 'numeric'};
        const formattedTime = today.toLocaleString('fr-FR', options);
        // console.log(username.textContent ,message.value, formattedTime);
        req = {
            "username": username.textContent,
            "content": message.value,
            "date": formattedTime,
        }
        socket.emit('addChat',  (req))
        // fetchAndRefesh();
    });

    async function fetchList(){
        let resp = await fetch('http://localhost:3000/chat');
        return await resp.json();
    }

    async function fetchAndRefesh(){
        let data = await fetchList();
        // console.log(data);
        refreshList(data);
    }
    function refreshList(data){
        let list = document.querySelector('#list');
        list.innerHTML = '';
        let username = document.getElementById("username");
        for (let i = 0; i < data.length; i++) {
            let li = document.createElement('li');
            if (username.textContent == data[i].username){
                li.classList.add('me');
            }
            li.dataset.id = data[i]._id;
            let nameDiv = document.createElement('div');
            nameDiv.classList.add('name');
            let nameSpan = document.createElement('span');
            nameSpan.textContent = data[i].username;
            nameDiv.appendChild(nameSpan);
            let messageDiv = document.createElement('div');
            messageDiv.classList.add('message');
            let messageP = document.createElement('p');
            messageP.textContent = data[i].content;
            messageDiv.appendChild(messageP); 
            let messageSpan = document.createElement('span');
            messageSpan.classList.add('msg-time');
            messageSpan.textContent = data[i].date;
            messageDiv.appendChild(messageSpan);
            li.appendChild(nameDiv);
            li.appendChild(messageDiv);
            list.appendChild(li);
        }
    }

    fetch(`${server}/test`).then((res) => {
        return res.json()
    }).then((data) => {
        console.log(data);
    })
})()