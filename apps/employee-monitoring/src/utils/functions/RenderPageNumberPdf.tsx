export const UseRenderPageNumberPdf = (pageNumber: number, totalPages: number) => {
  if (pageNumber === totalPages) {
    return '';
  } else {
    return `${pageNumber} / ${totalPages}`;
  }
};
