import style from "./wrapper.module.scss";
import React, { useEffect, useState } from "react";
import useScrollBlock from "@/lib/useScrollBlock";
import Image from "next/image";

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

const CloseIcon = () => {
  return (
    <svg
      width="800px"
      height="800px"
      viewBox="-0.5 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 21.32L21 3.32001"
        stroke="#000000"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M3 3.32001L21 21.32"
        stroke="#000000"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

type ModalProps = {
  artist: string;
  song: string;
  rank: number;
  closeModal: () => void;
};

const Modal = ({ artist, song, rank, closeModal }: ModalProps) => {
  const [followers, setFollowers] = useState(0);
  const [genres, setGenres] = useState([]);
  const [thumbnail, setThumbnail] = useState("");
  const [wiki, setWiki] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(
        `/api/artist_info?artist=${titleCase(artist).replace(" ", "_")}`
      );
      const json = await res.json();
      console.log(json);
      setFollowers(json.followers);
      setGenres(json.genres);
      setThumbnail(json.thumbnail);
      setWiki(json.wiki);
    };
    fetchData();
  }, [artist]);
  // console.log(followers, genres, thumbnail, wiki);
  return (
    <div className={style.modalBackground}>
      <div className={style.modalBox}>
        <div className={style.modalThumbnail}>
          <Image src={thumbnail} alt={artist} fill />
        </div>
        <button className={style.closeBtn} onClick={closeModal}>
          <CloseIcon />
        </button>
        <div className={style.modalHeader}>
          <h4>{titleCase(artist)}</h4>
          <p>{titleCase(song)}</p>
        </div>
        <div className={style.modalContent}>
          <p>{wiki}</p>
        </div>
        <p>
          Followers: <b>{followers}</b>
        </p>
      </div>
    </div>
  );
};

const Wrapper = () => {
  const [data, setData] = useState<IChartType[]>([]);
  const [updatedAt, setUpdatedAt] = useState("");
  const [loading, setLoading] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [currentArtist, setCurrentArtist] = useState("");
  const [currentSong, setCurrentSong] = useState("");
  const [currentRank, setCurrentRank] = useState(0);

  const [blockScroll, allowScroll] = useScrollBlock();

  const openModal = (artist: string, song: string, rank: number) => {
    blockScroll();
    setCurrentArtist(artist);
    setCurrentSong(song);
    setCurrentRank(rank);
    setShowModal(true);
  };

  const closeModal = () => {
    allowScroll();
    setShowModal(false);
    setCurrentArtist("");
    setCurrentSong("");
    setCurrentRank(0);
  };

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

  //trigger close modal on clicking outside of modal
  useEffect(() => {
    const closeOnOutsideClick = (e: MouseEvent) => {
      if (e.target === document.querySelector(`.${style.modalBackground}`)) {
        closeModal();
      }
    };
    if (showModal) {
      document.addEventListener("click", closeOnOutsideClick);
    }
    return () => {
      document.removeEventListener("click", closeOnOutsideClick);
    };
  }, [showModal]);

  if (loading) {
    return <div className={style.wrapper}>Loading...</div>;
  }
  return (
    <div className={style.wrapper}>
      {showModal && (
        <Modal
          artist={currentArtist}
          song={currentSong}
          rank={currentRank}
          closeModal={closeModal}
        />
      )}
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
            onClick={() => openModal(d.artist, d.song, d.rank)}
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
