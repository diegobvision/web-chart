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

const Wrapper = () => {
  const [data, setData] = useState<IChartType[]>([]);
  const [updatedAt, setUpdatedAt] = useState("");
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <div className={style.wrapper}>Loading...</div>;
  }
  return (
    <div className={style.wrapper}>
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
      <div className={style.chart}>
        {data.map((d, i) => (
          <div key={i} className={style.row}>
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
