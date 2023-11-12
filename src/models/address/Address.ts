/* eslint-disable @typescript-eslint/no-unused-vars */
interface ProvinceModel {
  id: string;
  province: string;
  municipality: MunicipalityModel[];
} //first

interface MunicipalityModel {
  id: string;
  name: string;
  barangay: BarangayModel[];
} // second

interface BarangayModel {
  id: string;
  barangay: string;
} // third

interface AddressModel {
  province: ProvinceModel[];
}
