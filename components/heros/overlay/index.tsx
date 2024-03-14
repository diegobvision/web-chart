import React from "react";
import Image from "next/image";
import styles from "./overlay.module.scss";

const OverlayHero = () => {
  return (
    <div className={styles.container}>
      <div className={styles.image}>
        <Image
          src="/images/hero1.jpg"
          alt="Hero"
          layout="fill"
          objectFit="cover"
          quality={100}
        />
      </div>
      <div className={styles.overlay}>
        <h2 className={styles.title}>Hero Title</h2>
        <p className={styles.description}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.
        </p>
      </div>
    </div>
  );
};

export default OverlayHero;
