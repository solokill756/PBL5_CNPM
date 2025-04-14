import React, { useState } from 'react';

function InputBox({ value, type, size = '', onChange, ...props }) {
    const [showPassword, setShowPassword] = useState(false);
    const [inputValue, setInputValue] = useState('');

    const handleTogglePassword = () => {
        setShowPassword((prev) => !prev);
    };

    const handleChange = (event) => {
        const value = event.target.value;
        setInputValue(value);
        if (onChange) {
            onChange(event); 
        }
    };

    const isPasswordType = type === 'password';
    const inputType = isPasswordType && showPassword ? 'text' : type;

    return (
        <div className="relative my-2">
            <input
                type={inputType}
                id={value}
                className={`${size} text-xs block rounded-sm px-2.5 pb-1.5 pt-4 text-gray-900 bg-gray-50 dark:bg-gray-700 border border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer`}
                placeholder=" "
                onChange={handleChange} 
                {...props} 
            />
            <label
                htmlFor={value}
                className="absolute text-xs text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-3 scale-90 top-3 z-10 origin-[0] start-2.5 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-3"
            >
                {value}
            </label>
            {isPasswordType && inputValue && (
                <button
                    type="button"
                    onClick={handleTogglePassword}
                    className="absolute text-xs right-2.5 font-semibold top-3 text-gray-500 dark:text-gray-400 focus:outline-none"
                >
                    {showPassword ? 'Ẩn' : 'Hiển thị'}
                </button>
            )}
        </div>
    );
}

export default InputBox;
