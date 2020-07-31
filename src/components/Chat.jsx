import React from 'react';
import socket from '../socket';

function Chat ({ users, messages, userName, roomId, onAddMessage }) {
  const [messageValue, setMessageValue] = React.useState('');
  const messagesRef = React.useRef(null);

  const onSendMessage = () => {
    socket.emit('ROOM:NEW_MESSAGE', {
      userName,
      roomId,
      text: messageValue
    });
    onAddMessage({ userName, text: messageValue });
    setMessageValue('');
  };

  React.useEffect(() => {
    messagesRef.current.scroll(0, messagesRef.current.scrollHeight);
  }, [messages]);

  return (
    <div className="chat">
      <div className="chat-users">
        Комната: <b>{roomId}</b>
        <hr />
        <b>Онлайн ({users.length}):</b>
        <ul>
          {users.map((name, index) => (
            <li key={name + index}>{name}</li>
          ))}
        </ul>
      </div>
      <div className="chat-messages">
        <div ref={messagesRef} className="messages">
          {
            messages.map((message) => {
              return  <div className="message">
              <p>{message.text}</p>
              <div>
                <span>{userName}</span>
              </div>
            </div>
            })
          }
        </div>
        <form>
          <textarea 
            value={messageValue} 
            className="form-control" 
            rows="3"
          ></textarea>
          <button onClick={onSendMessage} type="button" className="btn btn-primary">
            Отправить
          </button>
        </form>
      </div>
    </div>
  )
}

export default Chat;