import React from 'react'
import { useState, useEffect } from 'react';
import { Listbox } from '@headlessui/react'
import { RiArrowDropDownLine } from "react-icons/ri";

const Mention = ({ title, infor, options, onChangeTime, onToggleStatus, selectedValue, status }) => {
    const [selectedOption, setSelectedOption] = useState(
        options.find(opt => opt.value === selectedValue) || options[0]
    );
    const [isOn, setIsOn] = useState(status);

    const toggle = () => {
        const newState = !isOn;
        setIsOn(newState);
        onToggleStatus?.(newState);
    };

    useEffect(() => {
        if (selectedValue) {
            const matched = options.find(opt => opt.value === selectedValue);
            if (matched) setSelectedOption(matched);
        }
        setIsOn(status); 
    }, [selectedValue, status, options]);

    return (
        <div className='flex-col justify-between items-center'>
            <div className='flex flex-row justify-between items-center mb-4'>
                <h4 className='text-base font-semibold text-gray-900 dark:text-white mb-3 text-left'>{title}</h4>
                <div className='w-11 flex flex-row justify-between items-center'>
                    <div
                        onClick={toggle}
                        className={`w-10 h-5 flex items-center bg-gray-300 rounded-full cursor-pointer transition-all duration-300 ${isOn ? "bg-red-200" : ""}`}>
                        <div className={`w-6 h-6 rounded-full shadow-md transform duration-300 ease-in-out ${isOn ? "translate-x-4 bg-red-800" : "bg-white"}`}></div>
                    </div>
                </div>
            </div>
            <div className='flex justify-between items-center'>
                <div>
                    <span className='text-base font-normal text-gray-600 dark:text-gray-400'>{infor}</span>
                </div>
                <div className='relative w-32'>
                    <Listbox value={selectedOption} onChange={(opt) => {
                        setSelectedOption(opt);
                        onChangeTime?.(opt.value);
                    }}>
                        <div className="relative">
                            <Listbox.Button className="relative w-full cursor-pointer rounded-3xl border-2 border-gray-200 py-2 pl-4 pr-10 text-left text-gray-600 font-semibold hover:bg-gray-100 focus:outline-none">
                                <span>{selectedOption.label}</span>
                                <span className="pointer-events-none absolute inset-y-0 -right-2 flex items-center pr-3">
                                    <RiArrowDropDownLine className='w-10 h-10 text-gray-600' />
                                </span>
                            </Listbox.Button>
                            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-2xl bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                {options.map((opt, index) => (
                                    <Listbox.Option
                                        key={index}
                                        value={opt}
                                        className={({ active }) =>
                                            `relative cursor-pointer select-none py-2 pl-4 pr-4 text-gray-600 ${
                                                active ? 'bg-gray-100' : ''
                                            }`}>
                                        {opt.label}
                                    </Listbox.Option>
                                ))}
                            </Listbox.Options>
                        </div>
                    </Listbox>
                </div>
            </div>
        </div>
    );
};

export default Mention;
