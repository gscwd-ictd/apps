function UseRenderBadgePill(value: string | number) {
  return (
    <div className="flex items-center justify-center px-2 text-white truncate bg-blue-400 rounded sm:text-xs md:text-xs lg:text-sm">
      {value}
    </div>
  );
}

export default UseRenderBadgePill;
