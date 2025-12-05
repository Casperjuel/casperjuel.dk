import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "rickroll",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RickrollPage() {
  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "black",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <pre
        style={{
          margin: "auto",
          color: "#00bc00",
        }}
      >
        {`
        for ((i=0; i<=100; i++)); do
            open -n https://www.youtube.com/watch?v=dQw4w9WgXcQ && sleep 10
        done &
     `}
      </pre>
    </div>
  );
}
