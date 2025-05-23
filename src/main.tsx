// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux'
import {store} from "@/store/store.ts";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import {GoogleOAuthProvider} from "@react-oauth/google";




const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(

    <GoogleOAuthProvider clientId={process.env.VITE_GOOGLE_CLIENT_ID!}>
      <Provider store={store}>
          <QueryClientProvider client={queryClient}>
    <App />
              <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
      </Provider>
    </GoogleOAuthProvider>


)
