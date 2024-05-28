import React, { useState, useEffect } from "react";
import { Article } from "./ArticleForm";
import styles from "./BukiGallery.module.css";
import axios from "axios";

// Bukiの型を定義します
export type Buki = {
  id: string;
  name?: string;
  img?: string;
  type?: string;
};

// BukiGalleryのPropsの型を定義します
type BukiGalleryProps = {
  onBukiClick: (selectedBuki: Buki) => void;
};

const BukiGallery: React.FC<BukiGalleryProps> = ({ onBukiClick }) => {
  const [selectedBukiId, setSelectedBukiId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [bukis, setBukis] = useState<Buki[]>([]);

  useEffect(() => {
    fetchAllBukis();
  }, []);

  const fetchAllBukis = async () => {
    axios
      .get("https://spladvice-service-a3w4oxiwva-an.a.run.app/getBukis")
      .then((response) => {
        const bukis = response.data.map((record: any) => ({
          id: record.buki_id,
          name: record.buki_mei_jp,
          img: record.buki_img,
          type: record.buki_type,
        }));
        setBukis(bukis);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  };

  const handleImageClick = (id: string) => {
    setSelectedBukiId(id);
    setShowModal(false);
  };

  const bukiTypes = [
    { type: "shooter", name: "シューター" },
    { type: "roller", name: "ローラー" },
    { type: "charger", name: "チャージャー" },
    { type: "slosher", name: "スロッシャー" },
    { type: "splatling", name: "スピナー" },
    { type: "dualie", name: "マニューバ" },
    { type: "brella", name: "シェルター" },
    { type: "blaster", name: "ブラスター" },
    { type: "brush", name: "フデ" },
    { type: "stringer", name: "ストリンガー" },
    { type: "splatana", name: "ワイパー" },
  ];

  return (
    <div className={styles["buki-gallery-top"]}>
      <button type="button" onClick={() => setShowModal(true)}>
        ブキを選択
      </button>
      {showModal && (
        <div className={styles["modal-backdrop"]}>
          <div className={`${styles["image-gallery"]} component-top`}>
            {bukiTypes.map((bukiType) => (
              <div
                key={bukiType.type}
                className={styles["buki-type-container"]}
              >
                <h3 className={styles["buki-type-name"]}>{bukiType.name}</h3>
                {bukis
                  .filter((buki) => buki.type === bukiType.type)
                  .map((item) => (
                    <img
                      key={item.id}
                      src={`/img/${bukiType.type}/${item.img}`}
                      alt={item.id}
                      className={
                        selectedBukiId === item.id
                          ? styles.active
                          : styles.grayedOut
                      }
                      onClick={() => {
                        handleImageClick(item.id);
                        onBukiClick(item);
                      }}
                    />
                  ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BukiGallery;
