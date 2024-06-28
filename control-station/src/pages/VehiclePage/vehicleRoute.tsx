import { Data1Page } from './Data1Page/Data1Page';
import { Data2Page } from './Data2Page/Data2Page';
import { VehiclePage } from './VehiclePage';
import { Navigate } from 'react-router-dom';

export const vehicleRoute = {
    path: '/vehicle',
    element: <VehiclePage />,
    children: [
        { path: '', element: <Navigate to={'data-1'} /> },
        { path: 'data-1', element: <Data1Page /> },
        { path: 'data-2', element: <Data2Page /> },
    ],
};
