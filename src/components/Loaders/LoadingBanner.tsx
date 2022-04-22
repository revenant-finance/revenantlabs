import ReactTyped from 'react-typed'

interface LoadingBanner {
    title: string
    animated?: boolean
}

export default function LoadingBanner({ title, animated = true }: LoadingBanner) {
    return (
        <div className="flex items-center justify-center border-4 border-dotted border-neutral-800 rounded-2xl bg-neutral-800 bg-opacity-20">
            <p className="p-6 py-24 font-mono opacity-50 font-extended uppercase">
                {animated && <ReactTyped strings={[title]} loop />}
                {!animated && title}
            </p>
        </div>
    )
}
