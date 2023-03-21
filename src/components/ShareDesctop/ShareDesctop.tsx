import { Wraper, Icon } from "./ShareDesctop.styled";

export const ShareDesctop: React.FC<{ onClick: () => void }> = ({
  onClick,
}) => {
  return (
    <>
      <Wraper>
        <Icon size={24} onClick={onClick} />
      </Wraper>
    </>
  );
};
