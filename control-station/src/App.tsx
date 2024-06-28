import { Outlet } from 'react-router-dom';
import 'styles/global.scss';
import 'styles/scrollbars.scss';
import styles from './App.module.scss';
import { Sidebar } from 'components/Sidebar/Sidebar';
import { ReactComponent as Wheel } from 'assets/svg/wheel.svg';
import { ReactComponent as Cameras } from 'assets/svg/cameras.svg';
import { ReactComponent as TeamLogo } from 'assets/svg/team_logo.svg';
import { SplashScreen, WsHandlerProvider, useLoadBackend } from 'common';

export const App = () => {
    const isProduction = import.meta.env.PROD;
    const loadBackend = useLoadBackend(isProduction);

    return (
        <div className={styles.appWrapper}>
            {loadBackend.state === 'fulfilled' && (
                <WsHandlerProvider handler={loadBackend.wsHandler}>
                    <Sidebar
                        items={[
                            { path: '/vehicle', icon: <Wheel /> },
                            { path: '/cameras', icon: <Cameras /> },
                        ]}
                    />
                    <Outlet />
                </WsHandlerProvider>
            )}
            {loadBackend.state === 'pending' && (
                <SplashScreen>
                    <TeamLogo />
                </SplashScreen>
            )}
            {loadBackend.state === 'rejected' && (
                <div>{`${loadBackend.error}`}</div>
            )}
        </div>
    );
};
