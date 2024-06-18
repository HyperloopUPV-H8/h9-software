import { Title } from "components/Title/Title";
import styles from "./Cameras.module.scss";
import { LabeledCamera, useCameras } from "common";

type Props = {
    streams: MediaStream[];
};

export const Cameras = ({ streams }: Props) => {
    const { cameras } = useCameras(streams);

    return (
        <div className={styles.cameras}>
            <Title title="Live from inside Atlas" />
            {cameras.map((camera) => {
                return (
                    <LabeledCamera
                        key={camera.stream.id}
                        camera={camera}
                        height="16rem"
                        className={styles.camera}
                    />
                );
            })}
        </div>
    );
};
