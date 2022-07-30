import type { NextPage } from "next";
import Head from "next/head";
import { useState, useRef } from "react";
import { getPoolInfo, useCount } from "../api/counter";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setLoading] = useState(false);
  
  console.log(process.env.NEXT_PUBLIC_RPC_ENDPOINT)

  return (
    <div className={styles.container}>
      <Head>
        <title>Counter Dapp</title>
        <meta name="description" content="Counter dapp: an example dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Count</h1>

        <p
          className={
            isLoading ? [styles.count, styles.pulse].join(" ") : styles.count
          }
        >
        </p>

        pool_id: <input ref={inputRef}></input>

        <button onClick={async ()=>{
          setLoading(true);
          if(!inputRef.current) return;
          const pool_id = parseInt(inputRef.current.value, 10);
          const result = await getPoolInfo(pool_id);
          console.log({result})
          setLoading(false);
          
        }}>get pool info</button>

      </main>
    </div>
  );
};

export default Home;
