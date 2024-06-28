import styles from 'components/Window/Window.module.scss';

type Props = {
    title: string;
    children?: React.ReactNode;
    className?: string;
};

export const Window = ({ title, children, className }: Props) => {
    return (
        <article className={`${styles.window} ${className}`}>
            <header className={styles.header}>{title}</header>
            <div className={styles.content}>{children}</div>
        </article>
    );
};
