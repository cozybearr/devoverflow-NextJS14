'use client'

import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarTrigger } from '@/components/ui/menubar'
import { themes } from '@/constants'
import { useTheme } from '@/context/ThemeProvider'
import Image from 'next/image'

export default function Theme() {
  const { mode, setMode } = useTheme()
  return (
    <Menubar className='relative border-none shadow-none'>
      <MenubarMenu>
        <MenubarTrigger className='focus:bg-light-900 data-[state=open]:bg-light-900 dark:focus:bg-dark-200 dark:data-[state=open]:bg-dark-200 cursor-pointer'>
          {mode === 'light' ? (
            <Image src='/assets/icons/sun.svg' width={20} height={20} alt='Light Mode' className='active-theme' />
          ) : (
            <Image src='/assets/icons/moon.svg' width={20} height={20} alt='Light Mode' className='active-theme' />
          )}
        </MenubarTrigger>
        <MenubarContent className='dark:border-dark-400 background-light900_dark300 absolute -right-12 mt-3 min-w-[120px] rounded border py-2'>
          {themes.map((theme) => (
            <MenubarItem
              key={theme.value}
              onClick={() => {
                setMode(theme.value as 'light' | 'dark' | 'system')
                if (theme.value !== 'system') {
                  localStorage.setItem('theme', theme.value)
                } else {
                  localStorage.removeItem('theme')
                }
              }}
              className='dark:focus:bg-dark-400 focus:bg-light-800 flex cursor-pointer items-center gap-4 px-2.5 py-2'
            >
              <Image
                src={theme.icon}
                alt={theme.value}
                width={16}
                height={16}
                className={mode === theme.value ? 'active-theme' : ''}
              ></Image>
              <p className={`body-semibold ${mode === theme.value ? 'text-primary-500' : 'text-dark100_light900'}`}>
                {theme.label}
              </p>
            </MenubarItem>
          ))}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}
