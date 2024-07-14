import { SignedIn, UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import Theme from './Theme'
import MobileNav from './MobileNav'
import GlobalSearch from '../search/GlobalSearch'

export default function Navbar() {
  return (
    <nav className='flex-between background-light900_dark200 shadow-light-300 fixed left-0 top-0 z-50 min-h-[104px] w-full gap-5 p-6 sm:px-12 dark:shadow-none'>
      <Link href='/' className='flex items-center'>
        <Image src='/assets/images/site-logo.svg' width={23} height={23} alt='HelpMeDevs Logo' className='mr-1' />
        <p className='h2-bold font-spaceGrotesk text-dark100_light900'>Dev</p>
        <p className='h2-bold font-spaceGrotesk text-primary-500'>Overflow</p>
      </Link>
      <GlobalSearch />
      <div className='flex-between gap-5'>
        <Theme />
        <SignedIn>
          <UserButton
            appearance={{
              elements: {
                avatarBox: 'h-10 w-10',
              },
              variables: {
                colorPrimary: '#ff7000',
              },
            }}
          />
        </SignedIn>

        <MobileNav />
      </div>
    </nav>
  )
}
