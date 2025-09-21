import "./Homepage.scss";
import { Broadcasting } from "./Broadcasting";
import { ComingAuction } from "./Incoming-auction";
import { Recommendation } from "./Recommendation";
import { SellWithBidcast } from "./SellWithBidcast";
import { useEffect, useState } from "react";
import { HomepageCanvas } from "./components/HomePageKonva";

interface HomepageProps {
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export function Homepage(props: HomepageProps) {
    const [loadState, setLoadState] = useState<number>(0);
    useEffect(() => {
        if (loadState === 0) {
            props.setIsLoading(true);
        }
    }, [props, loadState]);
    return (
        <div>
            <section className={"Konva_container"}>
                <HomepageCanvas />
            </section>
            <section>
                <Broadcasting />
            </section>
            <section>
                <ComingAuction
                    setIsLoading={props.setIsLoading}
                    loadState={loadState}
                    setLoadState={setLoadState}
                />
            </section>
            <section>
                <Recommendation />
            </section>
            <section>
                <SellWithBidcast />
            </section>
        </div>
    );
}
