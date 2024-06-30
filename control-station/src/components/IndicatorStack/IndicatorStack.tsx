import styles from './IndicatorStack.module.scss';

interface Props {
    children: React.ReactNode;
    className?: string;
}

export const IndicatorStack = ({ children, className }: Props) => {
    return <div className={`${styles.container} ${className}`}>{children}</div>;
};
