import classNames from 'classnames'

interface SwapperInput {
    className?: string
    value: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    onClick: () => void
    buttonContent: any
    footerLeft?: any
    footerRight?: any
    readOnly?: boolean
}

export default function SwapperInput({
    className,
    value,
    onChange,
    onClick,
    buttonContent,
    footerLeft,
    footerRight,
    readOnly
}: SwapperInput) {
    return (
        <div
            className={classNames(
                className,
                'bg-opacity-75 bg-neutral-800 rounded-xl p-4 space-y-2'
            )}
        >
            <div className="flex gap-4">
                <input
                    type="number"
                    className={classNames('flex-1 bg-transparent outline-none w-full')}
                    onChange={onChange}
                    value={value}
                    readOnly={readOnly}
                />
                <button
                    onClick={onClick}
                    className="bg-opacity-75 bg-neutral-700 hover:bg-neutral-600 animate transition-all px-4 py-2 rounded-xl shadow"
                >
                    {buttonContent}
                </button>
            </div>
            {(footerLeft || footerRight) && (
                <div className="flex">
                    <p className="flex-1 font-mono text-sm opacity-75">{footerLeft}</p>
                    <p className="font-mono text-sm opacity-75">{footerRight}</p>
                </div>
            )}
        </div>
    )
}
