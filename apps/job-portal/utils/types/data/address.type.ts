export type AddressType = {
  permaHouseNumber: string | void | undefined;
  permaStreet: string | void | undefined;
  permaSubd: string | void | undefined;
  permaProv: string | void | undefined;
  permaProvCode: string | void | undefined;
  permaCity: string | void | undefined;
  permaCityCode: string | void | undefined;
  permaBrgy: string | void | undefined;
  permaBrgyCode: string | void | undefined;
  permaZipCode: string | void | undefined;
  resHouseNumber: string | void | undefined;
  resStreet: string | void | undefined;
  resSubd: string | void | undefined;
  resProv: string | void | undefined;
  resProvCode: string | void | undefined;
  resCity: string | void | undefined;
  resCityCode: string | void | undefined;
  resBrgy: string | void | undefined;
  resBrgyCode: string | void | undefined;
  resZipCode: string | void | undefined;
};

//Address
export type Address = {
  houseNumber: string;
  street: string;
  subdivision: string;
  barangay: string;
  city: string;
  province: string;
  zipCode: string;
  cityCode?: string | undefined;
  provCode?: string | undefined;
  brgyCode?: string | undefined;
};

export type CheckBoxAddress = {
  checkboxAddress: boolean;
};

export type PermaAddress = Address & CheckBoxAddress;

export type ResAddressForm = {
  resHouseNumber: string;
  resStreet: string;
  resSubdivision: string;
  resZipCode: string;
  resProvince: string;
  resProvCode: string;
  resCity: string;
  resCityCode: string;
  resBrgy: string;
  resBrgyCode: string;
};

export type PermaAddressForm = {
  permaHouseNumber: string;
  permaStreet: string;
  permaSubdivision: string;
  permaZipCode: string;
  permaProvince: string;
  permaProvCode: string;
  permaCity: string;
  permaCityCode: string;
  permaBrgy: string;
  permaBrgyCode: string;
};

export type AddressForm = {
  resHouseNumber: string;
  resStreet: string;
  resSubdivision: string;
  resProvince: string;
  resProvCode: string;
  resCity: string;
  resCityCode: string;
  resBrgy: string;
  resBrgyCode: string;
  resZipCode: string;
  permaHouseNumber: string;
  permaStreet: string;
  permaSubdivision: string;
  permaZipCode: string;
  permaProvince: string;
  permaProvCode: string;
  permaCity: string;
  permaCityCode: string;
  permaBrgy: string;
  permaBrgyCode: string;
  checkboxAddress: boolean;
};
