import Head from 'next/head'
import TitleCard from 'components/TitleCard/titleCard.js'
import Layout from 'components/layout.js'
import UploadBox from 'components/UploadBox/uploadBox.js'
import { server } from 'config';

export default function Home() {
    return (
      <>
        <Layout>
          <Head>
            <title>SHARE</title>
            <link rel="icon" href="/favicon.ico" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          </Head>

          <main>
            <h1>Share Files</h1>
            <UploadBox />
          </main>

        </Layout>

        <style jsx>{`
          h1 {
            margin-top: 15vh;
          }
        `}</style>
      </>
    )
}

