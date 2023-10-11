import Link from 'next/link'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

function MyLink({ href, note }: { href: string, note: string }) {
  return (
    <Link
      href={href}
    >
      <h2 className={`mb-3 text-2xl font-semibold`}>
        {note}{' '}
        <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
          -&gt;
        </span>
      </h2>
    </Link>
  )
}

export default function Home() {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <div className="text-center grid grid-rows-3 grid-flow-col gap-20">
        {MyLink({
          href: "/map/map-blank-basemap",
          note: "map-blank-basemap"
        })}
        {MyLink({
          href: "/map/map-gaode-heatmap",
          note: "map-gaode-heatmap"
        })}
        {MyLink({
          href: "/map/map-google-airarcline",
          note: "map-google-airarcline"
        })}
        {MyLink({
          href: "/map/map-mapbox-empty",
          note: "map-mapbox-empty"
        })}
        {MyLink({
          href: "/map/map-path-animation",
          note: "map-path-animation"
        })}
        {MyLink({
          href: "/draw",
          note: "draw with nebulagl"
        })}
      </div>
      <iframe className="border: 1px solid rgba(0, 0, 0, 0.1);border-radius:2px;" width="800" height="450" src="https://codesandbox.io/p/sandbox/github/Euraxluo/nebula.gl/tree/master/examples/nextjs-react18-editor-sample?file=/src/pages/editor.tsx"></iframe>
    </main>
  )
}