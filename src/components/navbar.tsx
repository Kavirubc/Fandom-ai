'use client'
import Image from 'next/image';
import React, { useState } from 'react';
import logo from '@/../public/icon-fn.png'; // Make sure this path is correct
import Link from 'next/link';
import { Menu, Sparkle, X } from 'lucide-react'; // Importing Lucide icons
import { IconArrowUpRight } from "@tabler/icons-react";
import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { useUser } from "@clerk/nextjs";




export const Navbar = () => {
    const { isSignedIn, user } = useUser();
    // State to manage the mobile menu's visibility
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div>
            <nav className=" py-3 bg-white/60 backdrop-blur-sm top-0 z-50 fixed w-full">
                <div className='px-5 md:px-16 flex flex-row justify-between items-center text-sm'>
                    <Link href='/'>
                        <div className='flex flex-row justify-between items-center'>
                            <Image src={logo} width={34} height={10} alt='logo' />
                        </div>
                    </Link>
                    <div>
                        <div className='md:hidden'>
                            <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>
                        </div>
                        <div className={`${isMenuOpen ? 'flex' : 'hidden'
                            } absolute flex-col top-full left-0 w-full bg-white pb-5 md:pb-0 md:static md:flex md:flex-row md:gap-x-10 content-center align-middle items-center z-50`}>
                            {/* <Link href='/community/join'>
                                <div className='text-slate-600 hover:text-slate-900 cursor-pointer hover:underline px-4 py-2 md:py-0 flex flex-row' >
                                    Waitlist  <IconArrowUpRight height={13} />
                                </div>
                            </Link>
                            <Link target='_blank' href='https://lu.ma/thedailygrind'>
                                <div className='text-slate-600 hover:text-slate-900 cursor-pointer hover:underline px-4 py-2 md:py-0 flex flex-row' >
                                    Follow us on Luma  <Sparkle height={13} />
                                </div>
                            </Link>
                            <Link href='/community'>
                                <div className='text-slate-600 hover:text-slate-900 cursor-pointer hover:underline px-4 py-2 md:py-0 flex flex-row' >
                                    Community
                                </div>
                            </Link> */}
                            {isSignedIn ? (
                                <div className='text-slate-600 hover:text-slate-900 cursor-pointer hover:underline px-4 py-2 md:py-0 flex flex-row' >
                                    <UserButton />
                                </div>
                            ) : (
                                <div className='text-slate-600 hover:text-slate-900 cursor-pointer  px-4 py-2 md:py-0 flex flex-row' >
                                    <SignInButton mode="modal">
                                        <button className="rounded-full border border-secondary bg-transparent px-4 py-1.5 text-base hover:text-white hover:bg-black">
                                            <span>Sign in</span>
                                        </button>
                                    </SignInButton>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
}
