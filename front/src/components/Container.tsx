import type { ReactNode } from "react"

interface ContainerProps {
    children: ReactNode;
    className?: string;

}

const Container = ({ children, className }: ContainerProps) => {
    return (
        <div className={`mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-2 sm:py-4 lg:py-6 max-w-4xl lg:max-w-7xl ${className || ''}`}>
            {children}
        </div>
    )
}

export default Container;