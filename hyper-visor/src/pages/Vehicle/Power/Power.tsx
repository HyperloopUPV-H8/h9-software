import "./Power.scss";
import { PowerSection } from "./components/PowerSection.tsx";
import { BatterySection } from "./components/BatterySection.tsx";
import { BatteryTag } from "./components/BatteryTag.tsx";
import { LevitationUnitTag } from "./components/LevitationUnitTag.tsx";
import { LevitationSection } from "./components/LevitationSection.tsx";
import { TagType } from "./models/TagType.ts";
import { useMeasurements } from "hooks/useMeasurements.ts";
import { selectPcuMeasurements } from "common";

export const Power = () => {
    const measurements = useMeasurements();
    const pcuData = selectPcuMeasurements(measurements);

    return (
        <div className={"power-section"}>
            <PowerSection />
            <BatterySection
                tags={[
                    <BatteryTag
                        name={"High voltage pack - 75 V"}
                        value={pcuData.accel.value.average}
                    />,
                    <BatteryTag
                        name={"Low voltage pack - 24 V"}
                        value={pcuData.accel.value.average}
                    />,
                ]}
            />
            {/* <MotorSection /> */}
            <LevitationSection
                tags={[
                    <LevitationUnitTag
                        value={pcuData.accel.value.average}
                        name={"HEMS 1"}
                        type={TagType.HEMS}
                    />,
                    <LevitationUnitTag
                        value={pcuData.accel.value.average}
                        name={"HEMS 2"}
                        type={TagType.HEMS}
                    />,
                    <LevitationUnitTag
                        value={pcuData.accel.value.average}
                        name={"HEMS 3"}
                        type={TagType.HEMS}
                    />,
                    <LevitationUnitTag
                        value={pcuData.accel.value.average}
                        name={"HEMS 4"}
                        type={TagType.HEMS}
                    />,
                    <LevitationUnitTag
                        value={pcuData.accel.value.average}
                        name={"EMS 1"}
                        type={TagType.EMS}
                    />,
                    <LevitationUnitTag
                        value={pcuData.accel.value.average}
                        name={"EMS 2"}
                        type={TagType.EMS}
                    />,
                    <LevitationUnitTag
                        value={pcuData.accel.value.average}
                        name={"EMS 3"}
                        type={TagType.EMS}
                    />,
                    <LevitationUnitTag
                        value={pcuData.accel.value.average}
                        name={"EMS 4"}
                        type={TagType.EMS}
                    />,
                ]}
            />
        </div>
    );
};
