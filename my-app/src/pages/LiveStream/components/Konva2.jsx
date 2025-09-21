import React, { useState, useRef, useEffect } from "react";
import { Stage, Layer } from "react-konva";
import { useSpring, animated } from "@react-spring/konva";
import star from "../assets/start.png";
import heart from "../assets/heart-with-arrow_hires.png";
import useImage from "use-image";

// setup pattern & animation field

function Starpop(props) {
    const [image] = useImage(star);
    const p3 = useSpring({
        config: { duration: 5000 },
        from: {
            x: props.width - 50,
            y: props.height - 150,
            rotation: 0,
            opacity: 0.7,
            scaleX: 1,
            scaleY: 1,
        },
        to: {
            config: { duration: 500 },
            x: props.width - 100 + Math.floor(Math.random() * 100),
            y: -100,
            rotation: Math.floor(Math.random() * 350),
            scaleX: 1,
            scaleY: 1,
        },
    });
    return (
        <animated.Image
            key={Math.random()}
            image={image}
            {...p3}
            width={30}
            height={30}
        />
    );
}

function Heartpop(props) {
    const [image] = useImage(heart);
    const p3 = useSpring({
        config: { duration: 5000 },
        from: {
            x: props.width - 100,
            y: props.height - 150,
            rotation: 0,
            opacity: 0.7,
            scaleX: 1,
            scaleY: 1,
        },
        to: {
            config: { duration: 500 },
            x: props.width - 150 + Math.floor(Math.random() * 100),
            y: -100,
            rotation: Math.floor(Math.random() * 350),
            scaleX: 1,
            scaleY: 1,
        },
    });
    return (
        <animated.Image
            key={Math.random()}
            image={image}
            {...p3}
            width={30}
            height={30}
        />
    );
}

export function Canvass(props) {
    const [starList, setStar] = useState([]);
    const [heartList, setHeart] = useState([]);
    const starRef = useRef(null);
    const heartRef = useRef(null);
    const width = props.video.current.scrollWidth;
    const height = props.video.current.scrollHeight;
    const onAddBtnClick = (event) => {
        setStar(
            starList.length > 15
                ? starList
                      .splice(1, 15)
                      .concat(
                          <Starpop
                              key={Math.random()}
                              width={width}
                              height={height}
                          />
                      )
                : starList.concat(
                      <Starpop
                          key={Math.random()}
                          width={width}
                          height={height}
                      />
                  )
        );
    };
    const onAddBtn2Click = (event) => {
        setHeart(
            heartList.length > 15
                ? heartList
                      .splice(1, 15)
                      .concat(
                          <Heartpop
                              key={Math.random()}
                              width={width}
                              height={height}
                          />
                      )
                : heartList.concat(
                      <Heartpop
                          key={Math.random()}
                          width={width}
                          height={height}
                      />
                  )
        );
    };
    const starAnimation = useSpring({
        config: { duration: 1000 },
        from: {
            x: props.video.current.scrollWidth - 50,
            y: props.video.current.scrollHeight - 10,
        },
        to: {
            x: props.video.current.scrollWidth - 50,
            y: props.video.current.scrollHeight - 10,
        },
    });
    const heartAnimation = useSpring({
        config: { duration: 1000 },
        from: {
            x: props.video.current.scrollWidth - 100,
            y: props.video.current.scrollHeight - 10,
        },
        to: {
            x: props.video.current.scrollWidth - 100,
            y: props.video.current.scrollHeight - 10,
        },
    });
    useEffect(() => {
        if (props.ws) {
            props.ws.on("starOnClick", () => {
                starRef.current.eventListeners.click[0].handler();
            });
            props.ws.on("heartOnClick", () => {
                heartRef.current.eventListeners.click[0].handler();
            });
        }
    }, [props.ws]);

    return (
        <Stage
            width={props.video.current.scrollWidth}
            height={props.video.current.scrollHeight - 100}
        >
            <Layer>
                {starList}
                <animated.Image
                    image={""}
                    {...starAnimation}
                    width={30}
                    height={30}
                    onClick={onAddBtnClick}
                    key={1}
                    ref={starRef}
                />
                {heartList}
                <animated.Image
                    image={""}
                    {...heartAnimation}
                    width={30}
                    height={30}
                    onClick={onAddBtn2Click}
                    key={2}
                    ref={heartRef}
                />
            </Layer>
        </Stage>
    );
}
