import { BoardsPage1 } from "./BoardsPage/BoardsPage1";
import { BoardsPage2 } from "./BoardsPage/BoardsPage2";
import { ControlPage } from "./ControlPage/ControlPage";
import { VehiclePage } from "./VehiclePage";
import { Navigate } from "react-router-dom";

export const vehicleRoute = {
    path: "/vehicle",
    element: <VehiclePage />,
    children: [
        { path: "", element: <Navigate to={"first"} /> },
        { path: "first", element: <BoardsPage1 /> },
        { path: "second", element: <BoardsPage2 /> },
        { path: "thirst", element: <ControlPage /> },
    ],
};
