import { Outlet } from "react-router-dom";
import Header from "../Header";

function DefaultGuest() {
    return ( 
        <div>
            <Header />
            <Outlet />
        </div>
     );
}

export default DefaultGuest;