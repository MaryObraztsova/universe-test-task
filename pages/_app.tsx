import "../src/styles/index.scss";
import { appWithTranslation } from "next-i18next";
import type { AppProps } from "next/app";
import Head from "next/head";
import Script from "next/script";
import React from "react";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <title>PDF Master</title>
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />

        {/* open graph */}
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/assets/img/og_image.jpg" />

        {/* @NOTE: required to improve performance of foxitpdf */}
        <Script src="/lib/preload-jr-worker.js" defer />
      </Head>
      <Component {...pageProps} />
    </>
  );
};

export default appWithTranslation(App);
