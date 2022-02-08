import ReactTyped from 'react-typed'

export default function LoadingBanner({ title }) {
    return (
        <div className="flex items-center justify-center border-4 border-dotted border-neutral-700">
            <p className="p-6 py-24 font-mono opacity-50">
                <ReactTyped strings={[title]} loop />
            </p>
        </div>
    )
}
