import Image from "next/image";

export const Logo = () => {
  return (
    <div>
      <Image
        width={130}
        height={130}
        src="/logo.svg"
        alt="company logo"
      ></Image>
    </div>
  );
};
