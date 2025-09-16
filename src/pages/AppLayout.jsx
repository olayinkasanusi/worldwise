//import AppNav from "../components/AppNav";
import Map from "../components/Map";
import SideBar from "../components/SideBar";
import User from "../components/User";
import { useAuth } from "../contexts/FakeAuthContext";

import styles from "./AppLayout.module.css";
import Login from "./Login";

function AppLayout() {
  const { isAuth } = useAuth();
  if (!isAuth) return <Login />;
  if (isAuth)
    return (
      <div className={styles.app}>
        <SideBar />
        <Map />
        {isAuth && <User />}
      </div>
    );
}

export default AppLayout;
