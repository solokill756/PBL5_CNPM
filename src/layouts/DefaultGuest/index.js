import { Outlet } from "react-router-dom";
import Header from "../Header";

function DefaultGuest() {
    return ( 
        <div>
           <div> <Header /></div>
            <Outlet />
        </div>
     );
}

export default DefaultGuest;