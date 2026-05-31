import { IProject } from "../../constants";
import { useEffect } from "react";

const ProjectModal = ({
  project,
  onClose,
}: {
  project: IProject | null;
  onClose: () => void;
}) => {
  useEffect(() => {
    if (!project) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [project, onClose]);

  if (!project) return null;

  const {
    name,
    description,
    gradient: [stop1, stop2],
    details,
  } = project;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.8)" }}
      onClick={onClose}
    >
      <div
        className="relative bg-gray-900 rounded-2xl overflow-hidden w-full shadow-2xl"
        style={{ maxWidth: "520px" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="px-6 pt-6 pb-5"
          style={{
            background: `linear-gradient(135deg, ${stop1} 0%, ${stop2} 100%)`,
          }}
        >
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="absolute top-4 right-4 text-white text-xl font-bold leading-none opacity-70 hover:opacity-100 transition-opacity"
          >
            ✕
          </button>
          <h1 className="text-3xl font-bold text-white">{name}</h1>
          {details?.period && (
            <p className="text-sm text-white mt-1" style={{ opacity: 0.75 }}>
              {details.period}
            </p>
          )}
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-gray-300 leading-relaxed mb-5">{description}</p>

          {details?.stack && (
            <div className="mb-5">
              <h3
                className="text-xs font-semibold uppercase tracking-widest mb-2"
                style={{ color: "#6B7280" }}
              >
                Stack technique
              </h3>
              <p className="text-gray-300 text-sm">{details.stack}</p>
            </div>
          )}

          {details?.features && details.features.length > 0 && (
            <div>
              <h3
                className="text-xs font-semibold uppercase tracking-widest mb-3"
                style={{ color: "#6B7280" }}
              >
                Fonctionnalités
              </h3>
              <ul className="space-y-2">
                {details.features.map((feature, i) => (
                  <li
                    key={i}
                    className="text-gray-300 text-sm flex items-start"
                  >
                    <span
                      className="mr-2 mt-0.5 font-bold"
                      style={{ color: "#FCD34D" }}
                    >
                      ›
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
