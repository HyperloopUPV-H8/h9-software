import { TagType } from "../models/TagType.ts";
import { ReactComponent as EMSIcon } from "assets/icons/ems.svg";
import { ReactComponent as HEMSIcon } from "assets/icons/hems.svg";

type Props = { value: number; name: string; type: TagType };

export const LevitationUnitTag = (props: Props) => {
    const getIcon = () =>
        props.type === TagType.HEMS ? (
            <HEMSIcon className={"lev-icon"} />
        ) : (
            <EMSIcon className={"lev-icon"} />
        );

    return (
        <div className={"levitation-unit-tag"}>
            <span>{getIcon()}</span>
            <div>
                <h3>{props.name}</h3>
                <p>{props.value.toFixed(2)} W</p>
            </div>
        </div>
    );
};
