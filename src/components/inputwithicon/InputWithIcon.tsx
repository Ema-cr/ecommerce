"use client";
import React from "react";

type Props = {
  icon: React.ReactNode;
  id?: string;
  name?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
};

export default function InputWithIcon({
  icon,
  id,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  className = "",
}: Props) {
  return (
    <div className={`relative ${className}`}>
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        {icon}
      </span>

      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-11 pr-3 py-2 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
