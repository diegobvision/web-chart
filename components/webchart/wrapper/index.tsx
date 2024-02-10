import style from "./wrapper.module.scss";
import React, { useEffect, useState } from "react";

type IChartType = {
  artist: string;
  song: string;
  rank: number;
};

const titleCase = (str: string) => {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const InfoIcon = () => {
  return (
    <svg
      width="800px"
      height="800px"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="10" stroke="#1C274C" stroke-width="1.5" />
      <path
        d="M12 17V11"
        stroke="#1C274C"
        stroke-width="1.5"
        stroke-linecap="round"
      />
      <circle
        cx="1"
        cy="1"
        r="1"
        transform="matrix(1 0 0 -1 11 9)"
        fill="#1C274C"
      />
    </svg>
  );
};

const Wrapper = () => {
  const [data, setData] = useState<IChartType[]>([]);
  const [updatedAt, setUpdatedAt] = useState("");
  const [loading, setLoading] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/webchart");
      const json = await res.json();
      setData(json.chart);
      setUpdatedAt(json.updated_at);
      setLoading(false);
    };
    fetchData();
  }, []);

  const openTooltip = () => {
    setShowTooltip(true);
    setTimeout(() => {
      setShowTooltip(false);
    }, 5000);
  };

  if (loading) {
    return <div className={style.wrapper}>Loading...</div>;
  }
  return (
    <div className={style.wrapper}>
      <div className={style.tooltip} onClick={openTooltip}>
        <InfoIcon />
      </div>
      {showTooltip && (
        <div className={style.updated_at}>
          <p className={style.date}>
            last updated <b>{new Date(updatedAt).toLocaleDateString()}</b>
          </p>
          <p className={style.time}>
            at{" "}
            {new Date(updatedAt)
              .toLocaleTimeString()
              .split(":")
              .slice(0, 2)
              .join(":")}
          </p>
        </div>
      )}
      <div className={style.chart}>
        {data.map((d, i) => (
          <div
            key={i}
            className={style.row}
            style={{ animationDelay: `${i / 5}s` }}
          >
            <div className={style.position}>{i + 1}</div>
            <div className={style.artist}>{titleCase(d.artist)}</div>
            <div className={style.song}>{titleCase(d.song)}</div>
            <div className={style.rank} style={{ width: d.rank }}>
              {d.rank}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wrapper;
