import { useGlobalTicker, useMeasurementsStore, useSubscribe } from "common";
import styles from "./VehiclePage.module.scss";

import { Pagination } from "components/Pagination/Pagination";
import { PageWrapper } from "pages/PageWrapper/PageWrapper";
import { Outlet } from "react-router-dom";
import { useOrders } from "useOrders";
import { fetchFromBackend } from "services/HTTPHandler";
import { useEffect, useState } from "react";

export const VehiclePage = () => {
    
    const [podData, setPodData] = useState(null);
    const initMeasurements = useMeasurementsStore(state => state.initMeasurements);

    useEffect(() => {
        const fetchPodDataAsync = async () => {
            const data = await fetchPodData();
            setPodData(data);
        };
        fetchPodDataAsync();
    }, []);

    useEffect(() => {
        if (podData) {
            initMeasurements(podData);
        }
    }, [podData, initMeasurements]);

    useOrders();

    return (
        <PageWrapper title="Vehicle">
            <Outlet />
            <Pagination routes={["first", "second", "thirst"]} />
        </PageWrapper>
    );
};

async function fetchPodData() {
    const response = await fetchFromBackend(
        import.meta.env.VITE_POD_DATA_DESCRIPTION_PATH
    );
    return response.json();
}