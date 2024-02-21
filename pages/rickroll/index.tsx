import Head from "next/head";

const page: NextPage = () => {
  return (
    <>
      <Head>
        <title>rickroll</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div className="test">
        <style jsx>{`
          .test {
            width: 100%;
            background-color: black;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
          }

          pre {
            margin: auto;
            color: #00bc00;
          }
        `}</style>
        <pre>
          {`
        for ((i=0; i<=100; i++)); do
            open -n https://www.youtube.com/watch?v=dQw4w9WgXcQ && sleep 10
        done &
     `}
        </pre>
      </div>
    </>
  );
};

export default page;
