import { Input } from '@/components/ui/input'
import Image from 'next/image'
import React from 'react'

const GlobalSearch = () => {
  return (
    <div className='relative w-full max-w-[600px] flex-1'>
      <div className='bg-light-800 dark:bg-dark-300 relative flex min-h-[56px] items-center gap-1 rounded-xl px-4  max-md:hidden'>
        <Image src='/assets/icons/search.svg' alt='search' width={24} height={24} className='cursor-pointer' />
        <Input
          type='text'
          placeholder='Search globally'
          className='no-focus paragraph-regular placeholder text-dark400_light700 bg-light-800 dark:bg-dark-300 shadow-nonee border-none'
        />
      </div>
    </div>
  )
}

export default GlobalSearch
