import { Article } from "components/Article/Article";
import styles from "./EMUnits.module.scss";
import React from "react";

type Props = {
    title: string;
    body: string;
    units: React.ReactNode[];
};

export const EMUnits = ({ title, body, units }: Props) => {
    return (
        <div className={styles.hems}>
            <Article
                title={title}
                body={body}
            />
            <div className={styles.tags}>
                {units.map((unit, index) => {
                    return <React.Fragment key={index}>{unit}</React.Fragment>;
                })}
            </div>
        </div>
    );
};
