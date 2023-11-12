/* eslint-disable @typescript-eslint/no-unused-vars */
import { MyVehiclePropertyModel } from '../my-property/MyProperty';

interface OwnerInformationModel {
  id: number;
  firstname: string;
  middlename: string;
  lastname: string;
  contactno: string;
  municipality: string;
  province: string;
  barangay: string;
  email: string;
} // displaying properties, ready for assumption

export interface VehicleForAssumptionInformationModel {
  id: number;
  userId: number;
  brand: string;
  model: string;
  owner: string;
  downpayment: string;
  location: string;
  installmentpaid: string;
  installmentduration: string;
  delinquent: string;
  description: string;
}
export interface PropertyAssumptionModel {
  userID: number;
  propertyID: number;
  ownerID: number;
  firstname: string;
  middlename: string;
  lastname: string;
  contactno: string;
  address: string;
  job: string;
  monthSalary: string;
} // used by generic assumption either Vehicle, Jewelry, HouseAndLot, Lot, House;;;; submition ni sa form sa assumption

export interface VehicleAssumptionModel {
  vehicle_id: number;
  vehicle_userId: number;
  vehicle_brand: string;
  vehicle_model: string;
  vehicle_owner: string;
  vehicle_downpayment: string;
  vehicle_location: string;
  vehicle_installmentpaid: string;
  vehicle_installmentduration: string;
  vehicle_delinquent: string;
  vehicle_description: string;
  vehicle_isDropped: string;
  user_id: number;
  user_email: string;
  user_firstname: string;
  user_middlename: string;
  user_lastname: string;
  user_contactno: string;
  user_gender: string;
  user_municipality: string;
  user_province: string;
  user_barangay: string;
  vehicleImages_id: number;
  vehicleImages_vehicleId: number;
  vehicleImages_vehicleFrontIMG: string;
  vehicleImages_vehicleRightIMG: string;
  vehicleImages_vehicleLeftIMG: string;
  vehicleImages_vehicleBackIMG: string;
  vehicleImages_vehicleCRIMG: string;
  vehicleImages_vehicleORIMG: string;
  property_id: number;
  property_userId: number;
  property_property_type: string;
} // for displaying properties, ready for assumption

export interface CertainVehicleModel {
  userId: number;
  brand: string;
  model: string;
  owner: string;
  downpayment: string;
  location: string;
  installmentpaid: string;
  delinquent: string;
  description: string;
  vehicleImages_id: number;
  vehicleImages_vehicleBackIMG: string;
  vehicleImages_vehicleCRIMG: string;
  vehicleImages_vehicleFrontIMG: string;
  vehicleImages_vehicleId: number;
  vehicleImages_vehicleLeftIMG: number;
  vehicleImages_vehicleORIMG: number;
  vehicleImages_vehicleRightIMG: number;
} // used for getting certain vehicle
