import Image from "../common/img";

const workImages = [
  { src: "/works/mt-conges-dashboard.png", label: "MT-Congés — Dashboard RH" },
  { src: "/works/mt-conges-login.png", label: "MT-Congés — Authentification" },
  { src: "/works/mj-1.png", label: "Motion Design — After Effects" },
  { src: "/works/mj-2.png", label: "Motion Design — After Effects" },
];

const HeroImage = () => (
  <div className="w-full grid grid-cols-2 gap-3 p-3" style={{ maxHeight: "650px" }}>
    {workImages.map((img, i) => (
      <div
        key={i}
        className="relative overflow-hidden rounded-xl"
        style={{ aspectRatio: "16/10" }}
      >
        <Image
          src={img.src}
          alt={img.label}
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-500 hover:scale-105"
        />
        <div
          className="absolute bottom-0 left-0 right-0 px-2 py-1 text-xs text-white font-medium"
          style={{
            background:
              "linear-gradient(0deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)",
          }}
        >
          {img.label}
        </div>
      </div>
    ))}
  </div>
);

export default HeroImage;
