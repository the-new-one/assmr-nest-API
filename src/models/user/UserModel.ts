export interface UserSignupModel {
  firstname: string;
  middlename: string;
  lastname: string;
  contactno: string;
  gender: string | null;
  municipality: string | null;
  province: string | null;
  barangay: string | null;
  email: string;
  password: string;
  userType: string;
} // mo create ug account ang user

export interface UserSigninModel {
  email: string;
  password: string;
} // basta mo login ang user

export interface ActiveUserCredentialsModel {
  userId: number;
  email: string;
  firstname: string;
  middlename: string;
  lastname: string;
  address: string;
  contactno: string;
  subscription: any;
  image: string;
  companyType: string;
} // basta accepted ang credentials sa user mao ni e return na mga info

export interface VehicleOwnerModel {
  email: string;
  color: string;
  brand: string;
  model: string;
  milage: string;
  condition: string;
  issue?: string;
  owner: string;
  location: string;
  downpayment: string;
  installmentpaid: string;
  installmentduration: string;
  remainingMonthsToPaid: string;
  assumePrice: string;
  monthlyPayment: string;
  delinquent: string;
  description: string;
  modeOfPayment: string;
  branchPurchase: string;
} // used for uploading vehicle property

export interface UpdateUserInformationModel extends UserSigninModel {
  firstname: string;
  middlename: string;
  lastname: string;
  contactno: string;
  municipality: string;
  province: string;
  barangay: string;
  newPassword: string;
  oldPassword: string;
  shouldUpdatePassword: any;
}

export interface JewelryOwnerModel {
  email: string;
  jewelryName: string;
  jewelryModel: string;
  owner: string;
  downpayment: number;
  location: string;
  installmentpaid: number;
  installmentduration: string;
  delinquent: string;
  description: string;
  karat: string;
  grams: string;
  material: string;
  modeOfPayment: string;
  remainingMonthsToPaid: string;
  assumePrice: string;
  monthlyPayment: string;
  pawnshopName: string;
}
export interface RealestateOwnerModel {
  email: string;
  realestateType: string;
  owner: string;
  developer: string;
  downpayment: number;
  location: string;
  installmentpaid: number;
  installmentduration: string;
  delinquent: string;
  description: string;
  modeOfPayment: string;
  remainingMonthsToPaid: string;
  assumePrice: string;
  monthlyPayment: string;
}
