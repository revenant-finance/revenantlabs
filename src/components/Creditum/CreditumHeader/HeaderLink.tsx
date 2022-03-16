import classNames from 'classnames'
import Link from 'next/link'
import { useRouter } from 'next/router'

interface HeaderLink {
    href: string
    icon: string
    children: any
    className?: string
}

export default function HeaderLink({ href, icon, children, className }: HeaderLink) {
    const router = useRouter()
    const isThisPage = router.asPath === href
    return (
        <div className="flex items-center">
            <Link href={href} passHref>
                <a
                    className={classNames(
                        'text-xs sm:text-base px-4 py-2 shadow-xl  border-2 border-neutral-800 rounded-2xl',
                        isThisPage
                            ? 'bg-yellow-400 text-neutral-800'
                            : 'bg-neutral-800 bg-opacity-50',
                        className
                    )}
                >
                    <i
                        className={classNames(
                            'text-xs mr-2',
                            isThisPage ? 'opacity-100' : 'opacity-25',
                            icon
                        )}
                    />
                    <span>{children}</span>
                </a>
            </Link>
        </div>
    )
}
