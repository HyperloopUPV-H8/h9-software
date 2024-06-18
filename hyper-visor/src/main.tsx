import "common/dist/style.css";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { Propulsion } from "pages/Vehicle/Propulsion/Propulsion.tsx";
import { ConfigProvider, GlobalTicker } from "common";
import {
    createBrowserRouter,
    Navigate,
    RouterProvider,
} from "react-router-dom";
import { Vehicle } from "pages/Vehicle/Vehicle.tsx";
import { Levitation } from "pages/Vehicle/Levitation/Levitation.tsx";
import { Tube } from "pages/Tube/Tube.tsx";
import { Power } from "pages/Vehicle/Power/Power.tsx";
import { CamerasPage } from "pages/CamerasPage/CamerasPage.tsx";
import { Provider } from "react-redux";
import { store } from "store.ts";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { path: "", element: <Navigate to={"vehicle"} /> },
            {
                path: "vehicle",
                element: <Vehicle />,
                children: [
                    { path: "", element: <Navigate to={"levitation"} /> },
                    {
                        path: "levitation",
                        element: <Levitation />,
                    },
                    {
                        path: "propulsion",
                        element: <Propulsion />,
                    },
                    {
                        path: "power",
                        element: <Power />,
                    },
                ],
            },
            {
                path: "tube",
                element: <Tube />,
            },
            {
                path: "cameras",
                element: <CamerasPage />,
            },
        ],
    },
    { path: "*", element: <Navigate to={"/"} /> },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <Provider store={store}>
            <ConfigProvider
                devIp="127.0.0.1"
                prodIp="192.168.0.9"
            >
                <GlobalTicker fps={20}>
                    <RouterProvider router={router}></RouterProvider>
                </GlobalTicker>
            </ConfigProvider>
        </Provider>
    </React.StrictMode>
);
