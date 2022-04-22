export default function Footer() {
    return (
        <>
            <div className="container p-12 py-24 mx-auto text-center max-w-7xl ">
                <div className="space-y-4">
                    <p className="max-w-md mx-auto font-serif text-lg">
                        <b>Revenant</b> — early 19th century: French, literally ‘coming back’, present participle (used as a noun) of <i>revenir</i>.
                    </p>

                    <p className="font-extrabold uppercase font-montserrat">Revenant Labs &copy; {new Date().getFullYear()}</p>
                    <p className="space-x-2 text-2xl">
                        <a href="/docs" target="_blank" className="underline">
                            Docs
                        </a>
                        <a href="/twitter" target="_blank">
                            <i className="fab fa-twitter" />
                        </a>
                        <a href="/discord" target="_blank">
                            <i className="fab fa-discord" />
                        </a>
                        <a href="/github" target="_blank">
                            <i className="fab fa-github" />
                        </a>
                        <a href="/medium" target="_blank">
                            <i className="fab fa-medium" />
                        </a>
                    </p>
                </div>
            </div>

            <div className="flex">
                <div className="flex-1 h-2 bg-purp" />
                <div className="flex-1 h-2 bg-salmon" />
                <div className="flex-1 h-2 bg-bluey" />
                <div className="flex-1 h-2 bg-greeny" />
                <div className="flex-1 h-2 bg-purp" />
                <div className="flex-1 h-2 bg-salmon" />
                <div className="flex-1 h-2 bg-bluey" />
                <div className="flex-1 h-2 bg-greeny" />
            </div>
        </>
    )
}
