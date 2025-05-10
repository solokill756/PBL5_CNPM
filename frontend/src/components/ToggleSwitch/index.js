import React from "react";

const ToggleSwitch = ({ label, onChange, checked = false, className = "" }) => {
  return (
    <div className={className}>
      <input
        className="mr-2 mt-[0.3rem] h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-neutral-300 before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-white after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-red-100 checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-red-700 checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:outline-none focus:ring-0 checked:focus:border-red-50 checked:focus:bg-red-50 checked:focus:before:ml-[1.0625rem]  dark:bg-neutral-600 dark:after:bg-neutral-400 dark:checked:bg-primary dark:checked:after:bg-primary"
        type="checkbox"
        role="switch"
        id="flexSwitchChecked"
        checked={checked}
        onChange={onChange}
      />
      <label
        className="inline-block pl-[0.15rem] hover:cursor-pointer"
        htmlFor="flexSwitchChecked"
      >
        {label}
      </label>
    </div>
  );
};

export default ToggleSwitch;
