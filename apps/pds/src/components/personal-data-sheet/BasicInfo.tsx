interface BasicInfoProps {
  lastname: string;
  firstName: string;
}

export const BasicInfo = ({
  lastname,
  firstName,
}: BasicInfoProps): JSX.Element => {
  return (
    <>
      {lastname} {firstName}
    </>
  );
};
