import Head from "next/head";
import { Logo } from "../src/assets/logo";
import type { NextPage } from "next";
import Script from "next/script";
import { Waves } from "../src/artwork/wave";
import dynamic from "next/dynamic";
import styles from "../styles/home.module.scss";

const P5Container = dynamic(() => import("../src/p5component"), { ssr: false });

const Home: NextPage = () => {
  return (
    <>
      <Script id="show-banner" strategy="lazyOnload">
        {`  (function (w, d, s, l, i) {
    w[l] = w[l] || [];
    w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
    var f = d.getElementsByTagName(s)[0],
      j = d.createElement(s),
      dl = l != "dataLayer" ? "&l=" + l : "";
    j.async = true;
    j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
    f.parentNode.insertBefore(j, f);
  })(window, document, "script", "dataLayer", "GTM-PDXMB9C");`}
      </Script>
      <Head>
        <title>CasperJuel – Creative Developer</title>
      </Head>
      <div className={styles.container}>
        <P5Container artwork={Waves} />
        <div className={styles.logo}>
          <Logo />
          <p>
            I’m a Creative Developer working at&nbsp;
            <a href="https://www.signifly.com/">Signifly</a>
          </p>
        </div>
        <div className={styles.footer}>
          <ul>
            <li>
              <a href="https://github.com/casperjuel/">Github</a>
            </li>
            <li>
              <a href="https://www.instagram.com/casper.juel/">Instagram</a>
            </li>
            <li>
              <a href="https://www.linkedin.com/in/casperjuel">LinkedIn</a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Home;
