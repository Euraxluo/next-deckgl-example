import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Page() {
    const router = useRouter();
    const { demo_name } = router.query;

    const RedirectTo404 = () => {
        const [redirectTo404, setRedirectTo404] = useState(false);

        // 设置一个3秒的延迟
        useEffect(() => {
            const timer = setTimeout(() => {
                // 在3秒后跳转到404页面
                setRedirectTo404(true);
            }, 3000);

            // 清除定时器，以防组件卸载
            return () => clearTimeout(timer);
        }, []);

        if (redirectTo404) {
            // 使用路由跳转而不是直接修改 window.location.href
            router.push('/404');
            return null; // 或者你可以返回一些提示信息
        }

        return (
            <div>
                loading {demo_name}...
            </div>
        );
    };

    const Map = dynamic(() => import('@/deckgl/' + demo_name), {
        ssr: false,
        loading: () => <RedirectTo404 />
    });

    return (
        <div className="container w-screen h-screen">
            <main className="flex w-full h-full flex-1 flex-col overflow-auto">
                <Map />
            </main>
        </div>
    );
}
