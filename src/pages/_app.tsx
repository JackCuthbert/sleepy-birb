import 'css-wipe'
import React, { FC } from 'react'
import { AppProps } from 'next/app'

const CustomApp: FC<AppProps> = ({ Component, pageProps }) => (
  <Component {...pageProps} />
)

export default CustomApp
