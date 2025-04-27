import React from 'react'
import { useState } from 'react';
import { Listbox } from '@headlessui/react'
import { RiArrowDropDownLine } from "react-icons/ri";


const Option = ({title, options}) => {
    const [selectedOption, setSelectedOption] = useState(options[0]);

    const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div className='flex justify-between items-center'>
        <div className='relative'>
                <Listbox value={selectedOption} onChange={setSelectedOption}>
                    <div className="relative">
                        <Listbox.Button className="relative w-full cursor-pointer rounded-3xl border-2 border-gray-200 py-2 pl-4 pr-10 text-gray-600 font-semibold hover:bg-gray-100 focus:outline-none">
                        <span>{selectedOption.label}</span>
                        <span className="pointer-events-none absolute inset-y-0 -right-2 flex items-center pr-3">
                            <RiArrowDropDownLine className='w-10 h-10 text-gray-600'/>
                        </span>
                        </Listbox.Button>

                        <Listbox.Options className="absolute z-0  mt-1 max-h-60 w-full overflow-auto rounded-2xl bg-white py-1 text-base font-medium shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ">
                        {options.map((opt, index) => (
                            <Listbox.Option
                            key={index}
                            value={opt}
                            className={({ active }) =>
                                `relative cursor-pointer select-none py-2 pl-4 pr-4 text-gray-600 ${
                                active ? 'bg-gray-100' : 'text-gray-600'
                                }`
                            }
                            >
                            {opt.label}
                            </Listbox.Option>
                        ))}
                        </Listbox.Options>
                    </div>
                </Listbox> 
        </div>
    </div>
  )
}
export default Option