export const DataPoint = ({ title, value }) => {
    return (
        <div className="flex items-center space-x-4 text-sm font-medium md:text-lg">
            <p className="">{title}</p>
            <div className="flex-1 h-0.5 md:h-1 bg-neutral-800"></div>
            <p className="font-mono">{value}</p>
        </div>
    )
}
export default DataPoint
