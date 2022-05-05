import '../styles/globals.css'
import type { FC } from 'react'
import type { NextComponentType } from 'next'
import type { AppProps as NextAppProps } from 'next/app'
import MainLayout from '../layouts/Main'

type ComponentProp = NextComponentType & {
  getLayout?: () => FC<{}>
}

type AppProps = NextAppProps & { Component: ComponentProp }

function Application({ Component, pageProps }: AppProps) {
  const getLayout =
    Component.getLayout || ((page) => <MainLayout>{page}</MainLayout>)

  return getLayout(<Component {...pageProps} />)
}

export default Application