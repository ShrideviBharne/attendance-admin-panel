import { AppProps } from 'next/app';
import '../styles/globals.css'; // Importing global styles
import styles from '../styles/home.module.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      
      <Component {...pageProps} />
      <Footer />
    </>
  );
}

export default MyApp;
