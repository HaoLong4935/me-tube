import { VideoGetOneOutput } from "../../types";

interface VideoBannerProps {
    status: VideoGetOneOutput["muxStatus"]
}

export const VideoBanner = ({ status }: VideoBannerProps) => {
    if (status === "ready") return null;

    return (
        <div className="">

        </div>
    )
}