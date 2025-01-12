import React, { useState, useEffect } from 'react';
import { trefoil } from 'ldrs'

trefoil.register()


import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; 

function Header() {
    return (
        <>
          <div className="absolute  z-20 flex justify-between items-center bg-white bg-opacity-60 backdrop-blur-sm  drop-shadow-xl w-full p-4 top-0">
            {/* Logo and Title */}
            <div className="flex justify-start items-center">
              <l-trefoil
                size="40"
                stroke="4"
                stroke-length="0.15"
                bg-opacity="0.1"
                speed="3"
                color="#b266f0"
              ></l-trefoil>
              <h1 className="text-purple-900 text-3xl ml-4 font-Cairo font-semibold">
                ChainLance
              </h1>
            </div>
      
            {/* Login and Sign-up Buttons */}
            <div className="flex justify-end items-center space-x-4">
              <button className="relative bg-white bg-opacity-70 text-black w-24 h-12 rounded-[11px] transition-all duration-300 ease-in-out hover:bg-purple-700 hover:text-white shadow-md cursor-pointer">
                <a href="/login">Login</a>
              </button>
              <button className="relative bg-white bg-opacity-70 text-black w-24 h-12 rounded-[11px] transition-all duration-300 ease-in-out hover:bg-purple-700 hover:text-white shadow-md cursor-pointer">
                <a href="/signup">Sign-up</a>
              </button>
            </div>
          </div>
        </>
      );
      
}
export default Header;