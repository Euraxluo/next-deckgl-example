
import { cn } from "@/components/lib";
import { Menu, XSquare } from "lucide-react";
import React from "react";

export function MapContainer({
    children,
    control,
    className
}: { children: React.ReactNode, control: React.ReactNode, className?: string }) {
    const [siderMenu, setSiderMenu] = React.useState<boolean>(false)
    return (
        <div className='min-h-screen 90vh'>
            {children}
            <div
                className={"absolute " + cn('hidden md:block top-0 right-0 h-full md:min-w-1/4 lg:min-w-1/5 xl:min-w-1/6 bg-white bg-opacity-80', className)}>
                {control}
            </div>
            {siderMenu && (
                <div
                    className={"absolute " + cn('block md:hidden top-0 right-0 h-full md:min-w-1/4 lg:min-w-1/5 xl:min-w-1/6 bg-white bg-opacity-80', className)}>
                    {control}
                </div>
            )}
            <button
                className="flex absolute top-1 right-1 bg-white bg-opacity-80 md:hidden"
                onClick={() => setSiderMenu(!siderMenu)}
            >
                {siderMenu ? <XSquare /> : <Menu />}
            </button>


        </div>
    )
}
