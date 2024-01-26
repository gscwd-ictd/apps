function UseRenderBooleanYesOrNo(value: boolean) {
  if (value === true || Boolean(value) === true) {
    return (
      <div className="bg-blue-200 text-blue-800 text-xs font-mono py-0.5 rounded w-full text-center">
        Yes
      </div>
    );
  } else if (value === false || Boolean(value) === false) {
    return (
      <div className="bg-red-200 text-red-800 text-xs font-mono py-0.5 rounded w-full text-center">
        No
      </div>
    );
  }
}

export default UseRenderBooleanYesOrNo;
