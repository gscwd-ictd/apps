function UseRenderBadgePill(value: string | number, textSize?: string) {
  return (
    <div className={`min-w-[1rem] pt-1 ${textSize ?? 'text-xs'}`}>
      <span className="bg-gray-300 text-gray-700 px-2 py-[0.2rem] rounded font-mono text-center">{value}</span>
    </div>
  );
}

export default UseRenderBadgePill;
