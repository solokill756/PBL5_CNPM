import React from 'react'
import OptionCard from '../CardItems/Option';

const InterfaceCard = (title, options) => {
    const Background = [
        { value: "auto", label: "Auto" },
        { value: "light", label: "Light" },
        { value: "dark", label: "Dark"}
      ];
      const Language = [
        { value: "vietnamese", label: "Tiếng Việt" },
        { value: "japanese", label: "日本語" },
        { value: "english", label: "English"}
      ];
  return (   
    <div className='border-2 border-gray-200 rounded-2xl shadow-sm mb-10 mt-3'>
         <div className='pt-8 pb-8 pl-6 pr-6 border-b-2 border-gray-200'>
            <OptionCard 
                title={"Hình nền"}
                options={Background}
            />
        </div>
        <div className='pt-8 pb-8 pl-6 pr-6 '>
            <OptionCard 
                title={"Ngôn ngữ"}
                options={Language}
            />
        </div>
    </div>
  )
}

export default InterfaceCard