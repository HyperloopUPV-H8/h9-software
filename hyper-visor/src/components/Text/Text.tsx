import styles from "./Text.module.scss";

type Props = {
    text: string;
};

export const Text = ({ text }: Props) => {
    return <div className={styles.text}>{text}</div>;
};
