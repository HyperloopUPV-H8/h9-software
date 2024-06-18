import { Outlet } from "react-router-dom";
import "styles/global.scss";
import "styles/scrollbars.scss";
import styles from "./App.module.scss";
import { Sidebar } from "components/Sidebar/Sidebar";
import { ReactComponent as Wheel } from "assets/svg/wheel.svg";
import { ReactComponent as Tube } from "assets/svg/tube.svg";
import { ReactComponent as Cameras } from "assets/svg/cameras.svg";
import {
    Loader,
    WsHandlerProvider,
    createWsHandler,
    useConfig,
    useConnectionsStore,
    useFetchBack,
    useMeasurementsStore,
    usePodDataStore,
} from "common";

export const App = () => {
    const setBackendConnection = useConnectionsStore(store => store.setBackendConnection);
    const initPodData = usePodDataStore(store => store.initPodData);
    const initMeasurements = useMeasurementsStore(store => store.initMeasurements);
    const config = useConfig();
    const podDataDescriptionPromise = useFetchBack(
        import.meta.env.PROD,
        config.paths.podDataDescription
    );

    const WS_URL = import.meta.env.PROD
        ? `${config.prodServer.ip}:${config.prodServer.port}/${config.paths.websocket}`
        : `${config.devServer.ip}:${config.devServer.port}/${config.paths.websocket}`;
    return (
        <div className={styles.appWrapper}>
            <Loader
                promises={[
                    createWsHandler(
                        WS_URL,
                        true,
                        () => setBackendConnection(true),
                        () => setBackendConnection(false)
                    ),
                    podDataDescriptionPromise.then((adapter) => {
                        initPodData(adapter);
                        initMeasurements(adapter);
                    }),
                ]}
                LoadingView={<div>Loading</div>}
                FailureView={<div>Failure</div>}
            >
                {([handler]) => (
                    <WsHandlerProvider handler={handler}>
                        <Sidebar
                            items={[
                                { path: "/vehicle", icon: <Wheel /> },
                                { path: "/cameras", icon: <Cameras /> },
                            ]}
                        />
                        <Outlet />
                    </WsHandlerProvider>
                )}
            </Loader>
        </div>
    );
};
