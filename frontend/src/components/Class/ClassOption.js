import React from 'react'
import { FaCircleCheck } from 'react-icons/fa6'

const ClassOption = ({ id, label, selected = true, onSelect }) => {
    return (
        <div
          className={`
            flex items-center gap-3 py-4 px-6 rounded-xl cursor-pointer transition-colors
            ${selected ? "bg-red-50" : "bg-zinc-100"}
          `}
          onClick={() => onSelect(id)}
        >
          <div
            className={`
              size-5 rounded-full flex items-center justify-center
              ${selected ? "text-red-400" : "text-slate-400 border-2 border-slate-300"} 
            `}
          >
            {selected ? <FaCircleCheck className="size-5" /> : null}
          </div>
          <span className={`${selected ? "text-red-400" : ""} text-base font-semibold text-gray-600`}>{label}</span>
        </div>
      )
}

export default ClassOption