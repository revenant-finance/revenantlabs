import classNames from 'classnames'

export const DataPoint = ({ title, value, lineClass = 'bg-white bg-opacity-10' }) => {
    return (
        <div className="flex items-center space-x-4 text-sm font-medium md:text-lg">
            <p className="">{title}</p>
            <div className={classNames('flex-1 h-0.5 md:h-1', lineClass)}></div>
            <p className="font-mono">{value}</p>
        </div>
    )
}
export default DataPoint
