import { Controller, Get } from '@nestjs/common';

@Controller('address')
export class AddressController {
  address: AddressModel = {
    province: [
      {
        id: 'aklan',
        province: 'Aklan',
        municipality: [],
      }, //aklan
      {
        id: 'antique',
        province: 'Antique',
        municipality: [],
      }, // antique
      {
        id: 'biliran',
        province: 'Biliran',
        municipality: [],
      }, // biliran
      {
        id: 'bohol',
        province: 'Bohol',
        municipality: [],
      }, // bohol
      {
        id: 'capiz',
        province: 'Capiz',
        municipality: [],
      }, // capiz
      {
        id: 'cebu',
        province: 'Cebu',
        municipality: [
          {
            id: 'cc',
            name: 'Cebu City',
            barangay: [
              {
                id: 'brgy.adlaon',
                barangay: 'Adlaon',
              },
              {
                id: 'brgy.agsungot',
                barangay: 'Agsungot',
              },
              {
                id: 'brgy.apas',
                barangay: 'Apas',
              },
              {
                id: 'brgy.babag',
                barangay: 'Babag',
              },
              {
                id: 'brgy.bacayan',
                barangay: 'Bacayan',
              },
              {
                id: 'brgy.banilad',
                barangay: 'Banilad',
              },
              {
                id: 'brgy.basak pardo',
                barangay: 'Basak Pardo',
              },
              {
                id: 'brgy.basak san nicolas',
                barangay: 'Basak San Nicolas',
              },
              {
                id: 'brgy.Binaliw',
                barangay: 'Binaliw',
              },
              {
                id: 'brgy.bonbon',
                barangay: 'Bonbon',
              },
              {
                id: 'brgy.budlaan',
                barangay: 'Budlaan',
              },
            ],
          },
          {
            id: 'crcr',
            name: 'Carcar',
            barangay: [
              {
                id: 'brgy.bolinawan',
                barangay: 'Bolinawan',
              },
              {
                id: 'brgy.buenavista',
                barangay: 'Buenavista',
              },
              {
                id: 'brgy.calidngan',
                barangay: 'Calidngan',
              },
            ],
          },
          {
            id: 'bntyn',
            name: 'Bantayan',
            barangay: [
              {
                id: 'brgy.atop-atop',
                barangay: 'Atop-Atop',
              },
              {
                id: 'brgy.baigad',
                barangay: 'Baigad',
              },
              {
                id: 'brgy.bantigue',
                barangay: 'Bantigue',
              },
              {
                id: 'brgy.baod',
                barangay: 'Baod',
              },
              {
                id: 'brgy.binaobao',
                barangay: 'Binaobao',
              },
            ],
          },
        ],
      }, // cebu
      {
        id: 'eastern samar',
        province: 'Eastern Samar',
        municipality: [
          {
            id: '',
            name: '',
            barangay: [],
          },
        ],
      }, // eastern samar
      {
        id: 'guimaras',
        province: 'Guimaras',
        municipality: [],
      }, // guimaras
      {
        id: 'ilo-ilo',
        province: 'Ilo Ilo',
        municipality: [],
      }, // ilo ilo
      {
        id: 'leyte',
        province: 'Leyte',
        municipality: [],
      }, // leyte
      {
        id: '',
        province: 'Negros Occidental',
        municipality: [],
      }, // negros occidental
      {
        id: '',
        province: 'Negros Oriental',
        municipality: [],
      }, // negros oriental
      {
        id: '',
        province: 'Northern Samar',
        municipality: [],
      }, // northern samar
      {
        id: '',
        province: 'Samar',
        municipality: [],
      }, // samar
      {
        id: '',
        province: 'Siquijor',
        municipality: [],
      }, // siquijor
      {
        id: '',
        province: 'Southern Leyte',
        municipality: [],
      }, // souther leyte
    ],
  };

  @Get()
  getAddress(): ResponseData<AddressModel> {
    return {
      code: 1,
      status: 200,
      message: 'Success',
      data: this.address,
    };
  }
}
