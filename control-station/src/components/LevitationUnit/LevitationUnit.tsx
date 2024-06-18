import styles from "./LevitationUnit.module.scss"
import { IndicatorStack } from "components/IndicatorStack/IndicatorStack"
import { BarIndicator } from "components/BarIndicator/BarIndicator"
import batteryFilled from "assets/svg/battery-filled.svg"
import thermometerFilled from "assets/svg/thermometer-filled.svg"

interface Props {
    measurementId?: string,
    imageSide: "left" | "right",
    imgSrc: string,
    rotate?: boolean
}

export const LevitationUnit = ({
    measurementId,
    imgSrc,
    imageSide,
    rotate
}: Props) => {
    return (
        <div className={styles.levitationUnitWrapper}>
            {imageSide === "left" && (
                <div className={styles.levitationUnitImage}>
                    <img
                        style={{ transform: rotate ? "rotate(180deg)" : "" }}
                        src={imgSrc}
                        alt="Levitation Unit"
                    />
                </div>
            )}
                <IndicatorStack>
                    <BarIndicator
                        icon={batteryFilled}
                        title="Current"
                        getValue={() => 0}
                        units="A"
                        safeRangeMin={0}
                        safeRangeMax={10}
                    />
                    <BarIndicator
                        icon={thermometerFilled}
                        title="Temperature"
                        getValue={() => 0}
                        units="ºC"
                        safeRangeMin={0}
                        safeRangeMax={10}
                    />
                    <BarIndicator
                        icon={batteryFilled}
                        title="Airgap"
                        getValue={() => 0}
                        units="mm"
                        safeRangeMin={0}
                        safeRangeMax={10}
                    />
                </IndicatorStack>
            {imageSide === "right" && (
                <div className={styles.levitationUnitImage}>
                    <img
                        style={{ transform: rotate ? "rotate(180deg)" : "" }}
                        src={imgSrc}
                        alt="Levitation Unit"
                    />
                </div>
            )}
        </div>
    )
}
