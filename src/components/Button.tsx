export default function Button(props) {
    const { children } = props
    return (
        <button {...props} className="">
            {children}
        </button>
    )
}
