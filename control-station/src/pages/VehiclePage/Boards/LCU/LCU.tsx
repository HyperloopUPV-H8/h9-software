import { Window } from "components/Window/Window"
import styles from "./LCU.module.scss"
import { LevitationUnit } from "components/LevitationUnit/LevitationUnit"
import ems from "assets/svg/ems.svg"
import hems from "assets/svg/hems.svg"
import { BarIndicator } from "components/BarIndicator/BarIndicator"
import pitchRotation from "assets/svg/pitch-rotation.svg"
import yawRotation from "assets/svg/yaw-rotation.svg"
import rollRotation from "assets/svg/roll-rotation.svg"
import zIndex from "assets/svg/z-index.svg"
import yIndex from "assets/svg/y-index.svg"
import { IndicatorStack } from "components/IndicatorStack/IndicatorStack"

export const LCU = () => {
    return (
        <Window title="LCU">
            <div className={styles.LCUWrapper}>
                <div className={styles.levitationUnitsWrapper}>
                    <div className={styles.levitationUnitsColumn}>
                        <LevitationUnit 
                            imgSrc={hems}
                            imageSide="left"
                        />
                        <LevitationUnit 
                            imgSrc={ems}
                            imageSide="left"
                        />
                        <LevitationUnit 
                            imgSrc={ems}
                            imageSide="left"
                        />
                        <LevitationUnit 
                            imgSrc={ems}
                            imageSide="left"
                        />
                        <LevitationUnit 
                            imgSrc={hems}
                            imageSide="left"
                        />
                    </div>

                    <div className={styles.levitationUnitsColumn}>
                        <LevitationUnit 
                            imgSrc={hems}
                            imageSide="right"
                        />
                        <LevitationUnit 
                            imgSrc={ems}
                            imageSide="right"
                            rotate
                        />
                        <LevitationUnit 
                            imgSrc={ems}
                            imageSide="right"
                            rotate
                        />
                        <LevitationUnit 
                            imgSrc={ems}
                            imageSide="right"
                            rotate
                        />
                        <LevitationUnit 
                            imgSrc={hems}
                            imageSide="right"
                        />
                    </div>
                </div>

                <div className={styles.rotationIndicatorsWrapper}>
                    <IndicatorStack>
                        <BarIndicator 
                            icon={pitchRotation}
                            title="Pitch"
                            getValue={() => 0}
                            safeRangeMin={0}
                            safeRangeMax={10}
                        />
                    </IndicatorStack>
                    <IndicatorStack>
                        <BarIndicator 
                            icon={rollRotation}
                            title="Roll"
                            getValue={() => 0}
                            safeRangeMin={0}
                            safeRangeMax={10}
                        />
                    </IndicatorStack>
                    <IndicatorStack>
                        <BarIndicator 
                            icon={yawRotation}
                            title="Yaw"
                            getValue={() => 0}
                            safeRangeMin={0}
                            safeRangeMax={10}
                        />
                    </IndicatorStack>
                    <IndicatorStack>
                        <BarIndicator 
                            icon={zIndex}
                            title="Z"
                            getValue={() => 0}
                            safeRangeMin={0}
                            safeRangeMax={10}
                        />
                    </IndicatorStack>
                    <IndicatorStack>
                        <BarIndicator 
                            icon={yIndex}
                            title="Y"
                            getValue={() => 0}
                            safeRangeMin={0}
                            safeRangeMax={10}
                        />
                    </IndicatorStack>
                    
                </div>
            </div>
        </Window>
    )
}
