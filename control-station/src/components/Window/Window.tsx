import styles from "components/Window/Window.module.scss";

type Props = {
    title: string;
    height?: "fit" | "fill";
    children?: React.ReactNode;
};

export const Window = ({ title, height = "fit", children }: Props) => {
    return (
        <article
            className={styles.window}
            style={{
                height:
                    height == "fit"
                        ? "fit-content"
                        : height == "fill"
                        ? "100%"
                        : "",
            }}
        >
            <header className={styles.header}>{title}</header>
            <div
                className={styles.content}
                style={{
                    flexGrow: height == "fill" ? "1" : "",
                }}
            >
                {children}
            </div>
        </article>
    );
};
