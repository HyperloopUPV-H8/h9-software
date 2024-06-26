import { NumericMeasurement, NumericMeasurementInfo } from "common";
import { EMUnits } from "../EMUnits/EMUnits";
import { ImageTag } from "../ImageTag/ImageTag";
import emsUrl from "assets/images/EMS.png";

type Props = {
    m1: NumericMeasurementInfo;
    m2: NumericMeasurementInfo;
    m3: NumericMeasurementInfo;
    m4: NumericMeasurementInfo;
};

const IMAGE_WIDTH = "7rem";

export const EMS = ({ m1, m2, m3, m4 }: Props) => {
    return (
        <EMUnits
            title="EMS Units"
            body="The EMS are electromagnets that keep Kénos centered horizontally."
            units={[
                <ImageTag
                    imageUrl={emsUrl}
                    measurement={m1}
                    width={IMAGE_WIDTH}
                />,
                <ImageTag
                    imageUrl={emsUrl}
                    measurement={m2}
                    width={IMAGE_WIDTH}
                />,
                <ImageTag
                    imageUrl={emsUrl}
                    measurement={m3}
                    width={IMAGE_WIDTH}
                />,
                <ImageTag
                    imageUrl={emsUrl}
                    measurement={m4}
                    width={IMAGE_WIDTH}
                />,
            ]}
        />
    );
};
