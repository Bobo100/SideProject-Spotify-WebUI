import { Provider } from 'react-redux';
import '@/styles/global.scss'
import 'tailwindcss/tailwind.css'
import { store } from '@/components/redux/store/store';
import { ThemeProvider } from 'next-themes';
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false

interface AppProps {
  Component: React.ComponentType;
  pageProps: any;
}
function App({ Component, pageProps }: AppProps) {
  return (
    <Provider store={store}>
      <ThemeProvider attribute="class">
        <Component {...pageProps} />
      </ThemeProvider>
    </Provider>
  )
}

export default App