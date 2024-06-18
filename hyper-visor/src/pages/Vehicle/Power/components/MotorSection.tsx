import { Title } from "components/Title/Title.tsx";
import { MotorTag } from "./MotorTag.tsx";

export const MotorSection = () => {
    return (
        <section className={"data-section"}>
            <Title title="Motor consumption" />
            <div className={"tag-grid"}>
                <MotorTag value={12.31} />
            </div>
        </section>
    );
};
