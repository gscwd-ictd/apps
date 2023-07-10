function UseRenderBadgePill(value: string | number) {
  return (
    <span className="items-center truncate flex justify-center truncate sm:text-xs md:text-xs lg:text-sm bg-blue-400 px-2 text-white rounded">
      {value}
    </span>
  );
}

export default UseRenderBadgePill;
