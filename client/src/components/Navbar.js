function Navbar() {
    return (
        <nav className="flex justify-between mt-2 mx-4">
            <a href="/">
                <h1 className="flex flex-row items-center text-[1.35em] font-[600]">
                    <span>
                        <img className="h-[32px] mr-1" src="/logo.png" alt="logo"></img>
                    </span>
                    Ethos
                </h1>
            </a>
            <ul className="flex">
                <li className="mr-4 ml-2"><a href="">Login</a></li>
                <li className="ml-2 mr-4"><a href="">Register</a></li>
            </ul>
        </nav>
    );
}
export default Navbar;