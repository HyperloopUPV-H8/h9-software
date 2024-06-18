import { Article } from "components/Article/Article";
import { Pump } from "./Pump/Pump";
import styles from "./Tube.module.scss";
import { DoubleGauge } from "components/DoubleGauge/DoubleGauge";
import { ReactComponent as TubeRealistic } from "assets/icons/tube-realistic.svg";
import { useMeasurements } from "hooks/useMeasurements";
import { selectLcuMeasurements } from "common";
//import { selectLcuMeasurements, selectTcuMeasurements } from "common";

export const Tube = () => {
    const measurements = useMeasurements();
    const lcuData = selectLcuMeasurements(measurements);
    //const tcuData = selectTcuMeasurements(measurements);

    return (
        <div className={styles.tube}>
            <div className={styles.tubeIcon}>
                <TubeRealistic />
            </div>
            <Article
                title="Atlas"
                body="Atlas is Hyperloop UPV's eight edition infrastructure. It provides the vehicle with a low pressure environment to levitate. This is some filler text to make the page take up as much space as possible. It doesn't mean anything nor it should be interpreted to mean something."
            />
            {/* FIXME: Change this data, but is not tcuMeasurements, CORRECT GAUGE SECTION */}
            <DoubleGauge
                // firstGauge={tcuData.pressure}
                // secondGauge={tcuData.temperature}
                firstGauge={lcuData.airgap_1}
                secondGauge={lcuData.airgap_2}
            />
            <Pump on={true} />
        </div>
    );
};
