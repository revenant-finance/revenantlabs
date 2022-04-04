import { formatter } from '../utils'

export default function Bar({ value }) {
    return (
        <div className="flex w-full items-center gap-2 text-xs">
            <div className="flex-1 h-2 bg-neutral-800 block rounded overflow-hidden">
                <div
                    className="h-full bg-gradient-to-br from-purple-500 to-blue-500 block"
                    style={{
                        width: `${value}%`
                    }}
                />
            </div>
            <p className="">
                <span>{formatter(value)}%</span>
            </p>
        </div>
    )
}
