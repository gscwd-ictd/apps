import { useState } from 'react'
import { Hamburger } from '../svg/Hamburger'

type SideNavProps = {
  action: Function
}

export const SideNav = ({ action }: SideNavProps) => {
  // set side navigation bar state
  const [navIsOpen, setNavIsOpen] = useState<boolean>(false)

  return (
    <>
      <main className={`flex min-h-screen flex-row bg-inherit opacity-80`} tabIndex={-1}>
        {/* Option SVG */}
        <div className={`flex ${navIsOpen ? 'w-24' : 'w-14'} flex-col overflow-hidden bg-slate-200 shadow-md shadow-slate-400 transition-all `}>
          <div
            onClick={() => setNavIsOpen(!navIsOpen)}
            className={`flex items-center ${navIsOpen ? 'justify-end' : 'justify-center'} h-10 px-2  hover:cursor-pointer`}
          >
            <span className="stroke-slate-900 hover:cursor-pointer hover:stroke-indigo-800 ">
              {navIsOpen ? (
                <button tabIndex={-1}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="inherit" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              ) : (
                <>
                  <Hamburger />
                </>
              )}
            </span>
          </div>
          <ul className="flex flex-col py-4">
            {/* <li>
              <a
                href="#"
                className="flex flex-row items-center h-12 text-gray-500 transition-transform duration-200 ease-in transform hover:translate-x-2 hover:text-gray-800"
              >
                <span className="inline-flex items-center justify-center w-12 h-12 text-lg text-gray-400">
                  <i className="bx bx-home"></i>
                </span>
                <span className="text-sm font-medium">Dashboard</span>
              </a>
            </li> */}

            {/* <li>
              <a
                href="#"
                className="flex flex-row items-center h-12 text-gray-500 transition-transform duration-200 ease-in transform hover:translate-x-2 hover:text-gray-800"
              >
                <span className="inline-flex items-center justify-center w-12 h-12 text-lg text-gray-400">
                  <i className="bx bx-music"></i>
                </span>
                <span className="text-sm font-medium">Music</span>
              </a>
            </li> */}
            {/* 
            <li>
              <a
                href="#"
                className="flex flex-row items-center h-12 text-gray-500 transition-transform duration-200 ease-in transform hover:translate-x-2 hover:text-gray-800"
              >
                <span className="inline-flex items-center justify-center w-12 h-12 text-lg text-gray-400">
                  <i className="bx bx-drink"></i>
                </span>
                <span className="text-sm font-medium">Drink</span>
              </a>
            </li> */}
            {/* 
            <li>
              <a
                href="#"
                className="flex flex-row items-center h-12 text-gray-500 transition-transform duration-200 ease-in transform hover:translate-x-2 hover:text-gray-800"
              >
                <span className="inline-flex items-center justify-center w-12 h-12 text-lg text-gray-400">
                  <i className="bx bx-shopping-bag"></i>
                </span>
                <span className="text-sm font-medium">Shopping</span>
              </a>
            </li> */}

            {/* <li>
              <a
                href="#"
                className="flex flex-row items-center h-12 text-gray-500 transition-transform duration-200 ease-in transform hover:translate-x-2 hover:text-gray-800"
              >
                <span className="inline-flex items-center justify-center w-12 h-12 text-lg text-gray-400">
                  <i className="bx bx-chat"></i>
                </span>
                <span className="text-sm font-medium">Chat</span>
              </a>
            </li> */}

            {/* <li className="px-2">
        
              <a href="#" className="flex flex-row items-center justify-center h-12 text-gray-500 hover:text-gray-800" tabIndex={-1}>
                <span className="inline-flex items-center justify-center w-12 h-12 text-lg text-gray-400">
                  <i className="bx bx-user"></i>
                </span>
                <span className={`text-sm font-medium ${navIsOpen ? 'visible' : 'hidden'}`}>Profile</span>
              </a>
            </li> */}

            {/* <li>
              <a
                href="#"
                className="flex flex-row items-center h-12 text-gray-500 transition-transform duration-200 ease-in transform hover:translate-x-2 hover:text-gray-800"
              >
                <span className="inline-flex items-center justify-center w-12 h-12 text-lg text-gray-400">
                  <i className="bx bx-bell"></i>
                </span>
                <span className="text-sm font-medium">Notifications</span>
                <span className="px-3 py-px ml-auto mr-6 text-sm text-red-500 bg-red-100 rounded-full">5</span>
              </a>
            </li> */}

            <li className="px-2">
              <a
                href="#"
                className="flex flex-row items-center justify-center h-12 text-gray-500 transition-all stroke-gray-600 hover:scale-105 hover:stroke-indigo-800 hover:text-indigo-800"
                tabIndex={-1}
                onClick={() => action()}
              >
                <span className="inline-flex items-center justify-center w-12 h-12 text-lg text-gray-400 ">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 " fill="none" viewBox="0 0 24 24" stroke="inherit" strokeWidth="2">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                </span>
                <span className={` text-sm font-medium ${navIsOpen ? 'visible' : 'hidden'}`}>Logout</span>
              </a>
            </li>
          </ul>
        </div>
      </main>
    </>
  )
}
