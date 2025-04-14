import React from 'react'
import Infor from '../CardItems/Infor';
import ProfileImge from '../CardItems/ProfileImg';
import Option from '../CardItems/Option';

const Card = () => {
  const Card = [
   {
    title: "Tên người dùng",
    infor: "volequyen11042005"
   },
   {
    title: "Email",
    infor: "volequyen11042005@gmail.com"
   },
  ];

  const Options = [
    { value: "user", label: "User" },
    { value: "adminr", label: "Admin" },
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
                <Infor title={card.title} infor={card.infor} operation="Sửa" />
              </div>
          ))}

        </div>


    </div>  
  );
}


export default Card