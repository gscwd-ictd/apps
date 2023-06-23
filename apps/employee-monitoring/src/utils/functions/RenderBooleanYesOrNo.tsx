function UseRenderBooleanYesOrNo(value: boolean) {
  if (value === true || Boolean(value) === true) {
    return (
      <div className="bg-blue-400 text-white text-xs font-medium py-0.5 rounded w-full text-center">
        Yes
      </div>
    );
  } else if (value === false || Boolean(value) === false) {
    return (
      <div className="bg-red-400 text-white text-xs font-medium py-0.5 rounded w-full text-center">
        No
      </div>
    );
  }
}

export default UseRenderBooleanYesOrNo;
