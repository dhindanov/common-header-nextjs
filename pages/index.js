import * as React from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "./index.module.scss";

const Home = () => {
  const router = useRouter();

  return (
    <>
      <div className={styles.container}>
        <Head>
          <title>Friendly Site</title>
        </Head>

        <main className={styles.main}>
          <h4 className={styles.title}>
            <Link href="/demo" passHref>
              <a>
                SSO Example: Login with Outside+
                <img src="/OutsideSignin.svg" width="180px" height="30px" />
              </a>
            </Link>
          </h4>
        </main>

        <footer className={styles.footer}> </footer>
      </div>

      <script src="/bundle.min.js"></script>
    </>
  );
};

export default Home;
