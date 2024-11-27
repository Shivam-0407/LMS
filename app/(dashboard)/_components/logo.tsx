import Image from "next/image";

const Logo = () => {
  return (  <div>
    <Image width={130} height={130} src='/logo.svg' alt="company logo"></Image>
  </div>);
}

export default Logo;
