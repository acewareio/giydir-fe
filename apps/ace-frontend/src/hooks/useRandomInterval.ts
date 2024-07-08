import { useEffect } from "react";

function useRandomInterval<T>(data: T[], setter: (item: T) => void, ms: number = 1000) {
    useEffect(() => {
        let count: number = 1;
        const interval = setInterval(() => {
            count++;
            count = data.length >= count ? count : 1;
            setter(data[count - 1]);
        }, ms);

        return () => {
            clearInterval(interval);
        };
    }, [data, setter]);
}

export default useRandomInterval;
