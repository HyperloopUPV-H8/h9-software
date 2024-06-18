import styles from "./ImageTag.module.scss";
import {BarTag} from "components/BarTag/BarTag";
import {NumericMeasurement} from "common";

type Props = {
    imageUrl: string;
    measurement: NumericMeasurement;
    width?: string;
    height?: string;
};

export const ImageTag = ({
    imageUrl,
    width = "3.5rem",
    height = "3.5rem",
    measurement,
}: Props) => {
    return (
        <article className={`${styles.imageTagWrapper} tagWrapper`}>
            <BarTag
                barType="range"
                measurement={measurement}
            />
            <img
                src={imageUrl}
                alt=""
                className={styles.image}
                style={{ width: width, height: height }}
            />
        </article>
    );
};
