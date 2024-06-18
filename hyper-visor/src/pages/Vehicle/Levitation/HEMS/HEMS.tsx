import { ImageTag } from "../ImageTag/ImageTag";
import hemsUrl from "assets/images/HEMS.png";
import { NumericMeasurementInfo } from "common";
import { EMUnits } from "../EMUnits/EMUnits";

const IMAGE_WIDTH = "7rem";

type Props = {
    m1: NumericMeasurementInfo;
};

export const HEMS = ({ m1 }: Props) => {
    return (
        <EMUnits
            title="HEMS Units"
            body="The HEMS are electromagnets that lift Kénos of the ground."
            units={[
                <ImageTag
                    imageUrl={hemsUrl}
                    measurement={m1}
                    width={IMAGE_WIDTH}
                />,
                // <ImageTag
                //     imageUrl={hemsUrl}
                //     measurement={m2}
                //     width={IMAGE_WIDTH}
                // />,
                // <ImageTag
                //     imageUrl={hemsUrl}
                //     measurement={m3}
                //     width={IMAGE_WIDTH}
                // />,
                // <ImageTag
                //     imageUrl={hemsUrl}
                //     measurement={m4}
                //     width={IMAGE_WIDTH}
                // />,
            ]}
        />
    );
};
