import styles from "./Title.module.scss";

type Props = {
    title: string;
    level?: number;
};

export const Title = ({ title, level = 1 }: Props) => {
    return (
        <div className={`${styles.title} ${styles[`l${level}`]}`}>{title}</div>
    );
};
