import Header from "./Header";
import Footer from "./Footer";
import Head from "next/head";

const Layout = ({ children }) => {
  return (
    <>
      <Head>
        <title>Nextjs-Dev Blog</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="mx-auto flex min-h-screen max-w-2xl flex-col">
        <Header />
        <main className="container mx-auto flex-grow px-4 sm:px-6">
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Layout;
