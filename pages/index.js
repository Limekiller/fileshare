import Head from 'next/head'
import TitleCard from 'components/TitleCard/titleCard.js'
import Layout from 'components/layout.js'
import LinkCard from 'components/LinkCard/linkCard.js'

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>FILESHARE</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <main>
        <TitleCard 
          title = 'FILESHARE'
          text = 'Upload some files to share, or download files with a code.'
        />

        <div className="flex center col-mobile pad-bottom">
          <LinkCard
            faStyles='fas fa-file-upload'
            title='Share Files'
            body='Upload one or more files and receive a shareable link or code'
            link='/share'
            linkText='Share Files'
          />
          <LinkCard
            faStyles='fas fa-file-download'
            title='Download Files'
            body='Have a link or code? Retrieve the files that have been shared with you.'
            link='/download'
            linkText='Retrieve Files'
          />
        </div>
      </main>

    </Layout>
  )
}
