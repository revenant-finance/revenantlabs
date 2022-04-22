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
    inputType?: string
}

export default function SwapperInput({
    className,
    value,
    onChange,
    onClick,
    buttonContent,
    footerLeft,
    footerRight,
    readOnly,
    inputType
}: SwapperInput) {
    return (
        <div
            className={classNames(
                className,
                'bg-opacity-75 bg-neutral-800 rounded-xl p-4 space-y-2'
            )}
        >
            <div className="flex gap-4 pb-3 border-0 border-b-2">
                <input
                    type={inputType || 'number'}
                    className={classNames(
                        'font-medium text-lg flex-1 bg-transparent outline-none w-full'
                    )}
                    onChange={onChange}
                    value={value}
                    readOnly={readOnly}
                />
                <button
                    onClick={onClick}
                    className="px-4 py-2 transition-all bg-opacity-75 shadow bg-neutral-700 hover:bg-neutral-600 animate rounded-xl"
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
