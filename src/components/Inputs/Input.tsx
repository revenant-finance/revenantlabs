interface Input {
    value: string | number
    loading?: boolean
    label?: any
    children?: any
    type?: string
    className?: string
    placeholder?: string
    // disabled?: boolean
    onChange?: (any) => any
    onMax?: (any) => any
}

export default function Input(props: Input) {
    const { children, loading, className, onMax, label } = props

    return (
        <div>
            {label && <p className="mb-1 text-xs font-medium">{label}</p>}
            <div className="flex items-stretch w-full overflow-hidden bg-white rounded bg-opacity-10">
                <input
                    {...props}
                    type={props.type || 'text'}
                    className="w-full h-full px-4 py-2 bg-transparent outline-none"
                />
                {onMax && (
                    <button onClick={onMax} className="px-2 text-xs font-medium">
                        Max
                    </button>
                )}
            </div>
        </div>

    )
}
