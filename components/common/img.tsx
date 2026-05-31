import NextImage, { ImageProps } from "next/image";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const Img = ({ src, ...props }: ImageProps) => {
  const prefixedSrc =
    typeof src === "string" && src.startsWith("/")
      ? `${basePath}${src}`
      : src;
  return <NextImage src={prefixedSrc} {...props} />;
};

export default Img;
