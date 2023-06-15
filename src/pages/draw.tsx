import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

export default function Page() {
    const router = useRouter()
    const { demo_name } = router.query
    const Map = dynamic(() => import('@/editor/map-draw'), {
        ssr: false,
        loading: () =>  (
            <div>
                loading {demo_name}...
            </div>
        )
    });
    return (
        <div className="container w-screen h-screen">
            <main className="flex w-full h-full flex-1 flex-col overflow-auto">
                <Map />
            </main>
        </div>
    )
}

