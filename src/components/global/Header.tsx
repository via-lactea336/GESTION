import React from "react";

type HeaderProps = {
  title: string;
  className?: string;
};

const Header = ({ title, className }: HeaderProps) => {
  return (
    <header
      className={`flex gap-3 justify-between items-center flex-wrap px-8 py-4 w-full rounded-md bg-primary-800 text-white ${className}`}
    >
      <h1 className="text-2xl font-bold">{title}</h1>
      <nav className="flex flex-wrap  items-center gap-6">
        <div className="flex items-center gap-3"></div>
      </nav>
    </header>
  );
};

export default Header;
