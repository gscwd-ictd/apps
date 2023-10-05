function UseRenderNameIcon(value: string) {
  const nameIcon = value.charAt(0);

  return (
    <div className="mx-auto bg-sky-400 rounded-full w-[3rem] h-[3rem]">
      <span className="text-lg text-white font-medium rounded-full bg-sky-500 flex items-center h-full w-full justify-center ">
        {nameIcon}
      </span>
    </div>
  );
}

export default UseRenderNameIcon;
