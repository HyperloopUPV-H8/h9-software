import { Title } from "components/Title/Title";
import React from "react";

type Props = {
    tags: [React.ReactNode, React.ReactNode];
};
export const BatterySection = (props: Props) => {
    return (
        <section className={"data-section"}>
            <Title title="Battery Packs" />
            <div className={"tag-grid"}>
                {props.tags.map((it, index) => (
                    <React.Fragment key={index}>{it}</React.Fragment>
                ))}
            </div>
        </section>
    );
};
