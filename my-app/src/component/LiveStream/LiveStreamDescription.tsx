import React from "react";

interface DescriptionProps {
    description: string;
}

function LiveStreamDescription(props: DescriptionProps) {
    return (
        <div className="LiveStreamDescription me-3 p-3 h-75 w-100">
            {props.description}
        </div>
    );
}

export default LiveStreamDescription;
