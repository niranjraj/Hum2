// import "react-date-range/dist/styles.css";
// import "react-date-range/dist/theme/default.css";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/style.scss";

import { wrapper } from "../redux/store";

import { SessionProvider } from "next-auth/react";

import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider session={pageProps.session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}

export default wrapper.withRedux(MyApp);
