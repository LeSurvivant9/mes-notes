"use client";
import React, { useEffect, useState } from "react";

interface ContainerProps {
  children: React.ReactNode;
}

const Container: React.FC<ContainerProps> = ({ children }) => {
  const [navbarHeight, setNavbarHeight] = useState(0);

  useEffect(() => {
    const header = document.querySelector("header");
    if (header) {
      setNavbarHeight(header.offsetHeight);
    }
  }, []);

  return (
    <div
      className={"px-4 mx-auto w-full max-w-7xl"}
      style={{ paddingTop: navbarHeight }}
    >
      {children}
    </div>
  );
};

export default Container;
