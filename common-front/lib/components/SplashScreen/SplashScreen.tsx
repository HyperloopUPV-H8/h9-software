import { ReactNode } from 'react';
import styles from './SplashScreen.module.scss';
import { animated, useSpring } from '@react-spring/web';

type Props = {
    children?: ReactNode;
};

export const SplashScreen = ({ children }: Props) => {
    const springs = useSpring({
        from: { transform: 'scale(0)' },
        to: { transform: 'scale(1)' },
        config: {
            mass: 5,
        },
        delay: 150,
        loop: true,
    });

    return (
        <div className={styles.splash_screen}>
            <animated.div style={{ ...springs }}>🐒{children}</animated.div>
        </div>
    );
};
