import "./styles/styles.scss";
import styles from "./App.module.scss";
import { Dock } from "components/Dock/Dock";
import { Outlet } from "react-router-dom";
import { ReactComponent as Wheel } from "assets/icons/wheel.svg";
import { ReactComponent as Tube } from "assets/icons/tube.svg";
import { ReactComponent as Camera } from "assets/icons/camera.svg";
import { DockItemData } from "components/Dock/DockItem/DockItem";
import {
    Loader,
    WsHandlerProvider,
    createWsHandler,
    useConfig,
    useFetchBack,
} from "common";
import { useDispatch } from "react-redux";
import { initPodData } from "slices/podDataSlice";
import { initMeasurements } from "slices/measurementsSlice";

const dockItems: DockItemData[] = [
    { icon: <Wheel />, path: "/vehicle" },
    { icon: <Tube />, path: "/tube" },
    { icon: <Camera />, path: "/cameras" },
];

function App() {
    const config = useConfig();
    const podDataDescriptionPromise = useFetchBack(
        import.meta.env.PROD,
        config.paths.podDataDescription
    );
    const SERVER_URL = import.meta.env.PROD
        ? `${config.prodServer.ip}:${config.prodServer.port}/${config.paths.websocket}`
        : `${config.devServer.ip}:${config.devServer.port}/${config.paths.websocket}`;

    const dispatch = useDispatch();
    return (
        <Loader
            LoadingView={<div>Loading</div>}
            FailureView={<div>Failure</div>}
            promises={[
                createWsHandler(SERVER_URL, true),
                podDataDescriptionPromise.then((adapter) => {
                    dispatch(initPodData(adapter));
                    dispatch(initMeasurements(adapter));
                }),
            ]}
        >
            {([handler]) => (
                <WsHandlerProvider handler={handler}>
                    <div className={styles.app}>
                        <main className={styles.content}>
                            <Outlet />
                        </main>
                        <Dock items={dockItems} />
                    </div>
                </WsHandlerProvider>
            )}
        </Loader>
    );
}

export default App;
