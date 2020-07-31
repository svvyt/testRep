import React from 'react'
import axios from 'axios';

function JoinBlock({ onLogin }) {
  const [roomId, setRoomId] = React.useState('');
  const [userName, setUserName] = React.useState('');
  const [isLoading, setLoading] = React.useState(true);

  const onEnter = async () => {
    if (!roomId || !userName) {
      return alert('Введите корректные данные');
    }
    const obj = {
      roomId,
      userName,
    }
    setLoading(true);
    await axios
    .post('/rooms', obj)
    onLogin();
  }

  return (
    <div className="join-block">
      <input 
        type="text" 
        placeholder="Room ID" 
        value={roomId} 
        onChange={(event) => setRoomId(event.target.value)} 
        required
      />
      <input 
        type="text"  
        placeholder="Ваше имя" 
        value={userName} 
        onChange={(event) => setUserName(event.target.value)}  
        required
      />
      <button disabled={isLoading} onClick={onEnter} className="btn btn-success">ВОЙТИ</button>
      {isLoading ? 'Входим...' : 'Войти'}
    </div> 
  )
}

export default JoinBlock;
