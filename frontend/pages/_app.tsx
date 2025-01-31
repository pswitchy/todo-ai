// pages/_app.tsx

import '../styles/globals.css'
import type { AppProps } from 'next/app'
import {AuthProvider} from '../context/AuthContext';
import {TaskProvider} from '../context/TaskContext';


export default function App({ Component, pageProps }: AppProps) {
  return (
      <AuthProvider>
          <TaskProvider>
              <Component {...pageProps} />
          </TaskProvider>
      </AuthProvider>
  )
}