const sChat = require('../models/chat');
module.exports = function (io) {
let session = {};
  io.on('connection', (socket) => {
    console.log(`Connecté au client ${socket.id}`)
    io.emit('notification', { type: 'new_user', data: socket.id });

    // Listener sur la déconnexion
    socket.on('disconnect', () => {
      console.log(`user ${socket.id} disconnected`);
      io.emit('notification', { type: 'removed_user', data: socket.id });
    });

    socket.on('...', (msg) => {

    });
    socket.on('addChat', (req)=>{
      console.log(req);
      const chat = new sChat(req);
      console.log(chat);
      chat.save().then(()=>{
        io.emit('Refresh');
      }).catch((error)=>{
        console.log(error);
      })
      // socket.emit('Refresh')
    })

    socket.on('Connect_User', (username)=>{
      console.log(username);
      session[socket.id] = {name : username};
      socket.emit('Connect_User',session)
    })
    socket.on('disconnect', () => {
      delete session[socket.id]; 
    });
    
  })
}