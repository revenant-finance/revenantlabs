export default function Footer() {
    return (
        <>
            <div className="max-w-7xl container mx-auto p-12 py-24 text-center ">
                <div className="space-y-4">
                    <p className="max-w-md mx-auto text-lg font-serif">
                        <b>Revenant</b> — early 19th century: French, literally ‘coming back’, present participle (used as a noun) of <i>revenir</i>.
                    </p>

                    <p className="font-montserrat font-extrabold uppercase">Revenant Labs &copy; {new Date().getFullYear()}</p>
                    <p className="text-2xl space-x-2">
                        <a href="/twitter" target="_blank">
                            <i className="fab fa-twitter" />
                        </a>
                        <a href="/twitter" target="_blank">
                            <i className="fab fa-discord" />
                        </a>
                        <a href="/twitter" target="_blank">
                            <i className="fab fa-github" />
                        </a>
                    </p>
                </div>
            </div>

            <div className="flex">
                <div className="bg-purp h-2 flex-1" />
                <div className="bg-salmon h-2 flex-1" />
                <div className="bg-bluey h-2 flex-1" />
                <div className="bg-greeny h-2 flex-1" />
                <div className="bg-purp h-2 flex-1" />
                <div className="bg-salmon h-2 flex-1" />
                <div className="bg-bluey h-2 flex-1" />
                <div className="bg-greeny h-2 flex-1" />
            </div>
        </>
    )
}
