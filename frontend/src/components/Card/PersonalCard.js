import React, {useState} from 'react'
import Infor from '../CardItems/Infor';
import ProfileImge from '../CardItems/ProfileImg';

const Card = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');

  const handleUserNameChange = (e) => setUserName(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);
  const Card = [
   {
    title: "Tên người dùng",
      infor: "volequyen11042005",
      confirm: "Đổi tên người dùng",
      note: "Tên người dùng của bạn chỉ có thể được thay đổi một lần",
      type: "text",
      value: userName,
      onchange: handleUserNameChange
   },
   {
      title: "Email",
      infor: "volequyen11042005@gmail.com",
      confirm: "Cập nhật email",
      note: "Nhập email mới",
      type: "text",
      value: email,
      onchange: handleEmailChange
   },
  ];

  return(
    <div className='border-2 border-gray-200 rounded-2xl shadow-sm mb-10 mt-3'>
        <div className='border-b-2 p-6'>
            <ProfileImge />
        </div>
         <div>
         {Card.map((card, index) => (
              <div
                key={index}
                className={`p-6 ${index !== Card.length - 1 ? 'border-b-2 border-gray-200' : ''}`}
              >
                <Infor 
                  title={card.title} 
                  infor={card.infor} 
                  confirm={card.confirm} 
                  note={card.note} 
                  type={card.type} 
                  value={card.value} 
                  onchange={card.onchange} 
                  operation="Sửa" />
              </div>
          ))}

        </div>


    </div>  
  );
}


export default Card