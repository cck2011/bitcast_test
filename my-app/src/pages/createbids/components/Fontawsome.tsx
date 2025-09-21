import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faCalendarAlt,
    faTimes,
    faClipboard,
} from "@fortawesome/free-solid-svg-icons";

export function DatePickerIcon() {
    return <FontAwesomeIcon icon={faCalendarAlt} className={"DateIcon"} />;
}

export function CloseCross() {
    return <FontAwesomeIcon icon={faTimes} className={"CloseCross"} />;
}
export function FaClipboard() {
    return <FontAwesomeIcon icon={faClipboard} className={"FaClipboard"} />;
}

export function loadingComponentTest() {
    return <div>hi</div>;
}
