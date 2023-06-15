import { ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function classMerge(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function MapDrawLayout({ children, control, className }: { children: React.ReactNode, control: React.ReactNode, className?: string }) {
    return (
        <div className='h-9/10 overflow-hidden'>
            {children}
            <div className={"absolute " + classMerge('top-0 right-0 h-full bg-white bg-opacity-80', className)}>
                {control}
            </div>
        </div>
    )
}
