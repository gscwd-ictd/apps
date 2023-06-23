/* This example requires Tailwind CSS v2.0+ */
import React, { Fragment, useContext } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
// import { MenuIcon, XIcon } from '@heroicons/react/outline'
import { HiArrowSmLeft } from 'react-icons/hi'
import { useRouter } from 'next/router'
import { useEmployeeStore } from '../../../store/employee.store'

type NavProps = {
  action: Function
}

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ')
}

export default function DarkNav({ action }: NavProps) {
  const employee = useEmployeeStore((state) => state.employeeDetails)

  const user = {
    name: `${employee.profile.firstName} ${employee.profile.lastName}`,
    email: 'example@gscwd.com',
    imageUrl: 'https://cdn.icon-icons.com/icons2/2506/PNG/512/user_icon_150670.png',
  }

  const userNavigation = [
    // { name: 'Your Profile', href: '#' },
    // { name: 'Settings', href: '#' },
    { name: 'Sign out', href: '#', action: action },
  ]

  const navigation = [{ name: 'Dashboard', href: '#', current: true }]

  const router = useRouter()

  return (
    <>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-gray-100">
        <body class="h-full">
        ```
      */}
      <div className="fixed top-0 w-full">
        <Disclosure as="nav" className="bg-slate-100">
          {({ open }) => (
            <>
              <div className="min-w-full px-4 mx-auto sm:px-6 lg:px-8">
                <div className="flex h-16 grid-cols-3 pt-2 pb-2">
                  {/** 1*/}
                  <div className="flex w-full col-span-1">
                    {/** REMOVE THIS PART TO REMOVE GO BACK BUTTON */}
                    <button className="flex items-center gap-2 mb-5 text-gray-500 transition-colors ease-in-out hover:text-gray-700" onClick={() => router.back()}>
                      <HiArrowSmLeft className="w-5 h-5" />
                      <span className="font-medium">Go Back</span>
                    </button>
                    {/** REMOVE THIS PART TO REMOVE GO BACK BUTTON */}
                  </div>
                  {/** 1*/}



                  {/** 2*/}
                  <div className="flex justify-center w-full col-span-1">
                    <div className="flex items-center">
                      <div className="flex md:block">
                        <div className="items-baseline space-x-4">
                          <span className="w-full subpixel-antialiased font-medium tracking-widest text-indigo-800 uppercase select-none sm:text-sm md:text-4xl drop-shadow-lg shrink-0">
                            Personal Data Sheet
                          </span>

                          {/* {navigation.map((item) => (
                            <a
                              key={item.name}
                              href={item.href}
                              className={classNames(
                                item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                'rounded-md px-3 py-2 text-sm font-medium'
                              )}
                              aria-current={item.current ? 'page' : undefined}
                            >
                              {item.name}
                            </a>
                          ))} */}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/**2 */}

                  {/** 3 */}
                  <div className="flex justify-end w-full col-span-1">

                  </div>

                  {/** 3 */}
                  {/** */}
                </div>
              </div>

              <Disclosure.Panel className="md:hidden">
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                  {navigation.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as="a"
                      href={item.href}
                      className={classNames(
                        item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                        'block rounded-md px-3 py-2 text-base font-medium'
                      )}
                      aria-current={item.current ? 'page' : undefined}
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                </div>
                <div className="pt-4 pb-3 border-t border-gray-700">
                  <div className="flex items-center px-5">
                    <div className="flex-shrink-0">
                      <img className="w-10 h-10 bg-white rounded-full stroke-white" src={user.imageUrl} alt="" />
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium leading-none text-slate-800">{user.name}</div>
                      <div className="text-sm font-medium leading-none text-slate-400">{user.email}</div>
                    </div>

                    {/** Notification Area */}
                    {/* <button
                      type="button"
                      className="flex-shrink-0 p-1 ml-auto text-gray-400 bg-gray-800 rounded-full hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                    >
                      <span className="sr-only">View notifications</span>
                      <BellIcon className="w-6 h-6" aria-hidden="true" />
                    </button> */}

                    {/**End of Notification Area */}
                  </div>
                  <div className="px-2 mt-3 space-y-1">
                    {userNavigation.map((item) => (
                      <Disclosure.Button
                        key={item.name}
                        as="a"
                        href={item.href}
                        className="block px-3 py-2 text-base font-medium text-gray-400 rounded-md hover:bg-gray-700 hover:text-white"
                      >
                        {item.name}
                      </Disclosure.Button>
                    ))}
                  </div>
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>

        <header className="bg-white shadow">
          {/* <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          </div> */}
        </header>
        <main>
          <div className="py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
            {/* Replace with your content */}
            {/* <div className="px-4 py-6 sm:px-0">
              <div className="border-4 border-gray-200 border-dashed rounded-lg h-96" />
            </div> */}
            {/* /End replace */}
          </div>
        </main>
      </div>
    </>
  )
}
