import styles from "./Article.module.scss";
import { Text } from "components/Text/Text";
import { Title } from "components/Title/Title";

type Props = {
    title: string;
    body: string;
};

export const Article = ({ title, body }: Props) => {
    return (
        <div className={styles.article}>
            <Title title={title} />
            <Text text={body} />
        </div>
    );
};
