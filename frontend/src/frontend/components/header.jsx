import React, { useState, useEffect } from 'react';
import { trefoil } from 'ldrs'

trefoil.register()


import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; 

function Header() {
    return (
        <>
          <div className="absolute flex justify-between items-center bg-white bg-opacity-60 backdrop-blur-sm  drop-shadow-xl w-full p-4 top-0">
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
                ChainVance
              </h1>
            </div>
      
            {/* Login and Sign-up Buttons */}
            <div className="flex justify-end items-center space-x-4">
              <button className="flex justify-center item-center bg-white bg-opacity-70 text-black w-auto h-auto p-3 rounded-[11px] transition-all duration-300 ease-in-out hover:-translate-y-1 hover:scale-110 shadow-md cursor-pointer">
              <div>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#000" fill-rule="evenodd" d="M1.625 12c0 .414.336.75.75.75h10.973l-1.961 1.68a.75.75 0 1 0 .976 1.14l3.5-3a.75.75 0 0 0 0-1.14l-3.5-3a.75.75 0 1 0-.976 1.14l1.96 1.68H2.376a.75.75 0 0 0-.75.75" clip-rule="evenodd"/><path fill="#000" d="M9.375 9.75h.378a2.25 2.25 0 0 1 3.586-2.458l3.5 3a2.25 2.25 0 0 1 0 3.416l-3.5 3a2.25 2.25 0 0 1-3.586-2.458h-.378V16c0 2.828 0 4.243.879 5.121c.878.879 2.293.879 5.121.879h1c2.828 0 4.243 0 5.121-.879c.879-.878.879-2.293.879-5.121V8c0-2.828 0-4.243-.879-5.121C20.618 2 19.203 2 16.375 2h-1c-2.828 0-4.243 0-5.121.879c-.879.878-.879 2.293-.879 5.121z"/></svg>
              </div>
              <div>
              <a className='ml-2'    href="/login">Login</a>
              </div>
                
              </button>
              <button className="flex justify-center item-center bg-white bg-opacity-70 text-black w-auto h-auto p-3 rounded-[11px] transition-all duration-300 ease-in-out hover:scale-110 hover:-translate-y-1  shadow-md cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#000" d="M15 14c-2.67 0-8 1.33-8 4v2h16v-2c0-2.67-5.33-4-8-4m-9-4V7H4v3H1v2h3v3h2v-3h3v-2m6 2a4 4 0 0 0 4-4a4 4 0 0 0-4-4a4 4 0 0 0-4 4a4 4 0 0 0 4 4"/></svg>


                <a className='ml-2' href="/signup">Sign-up</a>
              </button>
            </div>
          </div>
        </>
      );
      
}
export default Header;