import Head from 'next/head'
type HeadProps = {
    title: string
    rel?: string
    href?: string
}

export const HeadContainer = ({ title = 'Default Title', rel = 'icon', href = '/favicon.ico' }: HeadProps) => {
    return <>
        <Head>
            <title>{title}</title>
            <link rel={rel} href={href} />
        </Head>
    </>
}