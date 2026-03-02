import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

function Layout({ children, setPage }) {
    return (
        <>
            <Header />
            <Sidebar setPage={setPage} />
            <div className="main">{children}</div>
        </>
    );
}

export default Layout;
