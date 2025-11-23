
export type State = {
  nombre: string;
  municipios: string[];
};

export const mexicoStates: State[] = [
  {
    nombre: "Aguascalientes",
    municipios: ["Aguascalientes", "Asientos", "Calvillo", "Cosío"],
  },
  {
    nombre: "Baja California",
    municipios: ["Ensenada", "Mexicali", "Tecate", "Tijuana", "Playas de Rosarito"],
  },
  {
    nombre: "Ciudad de México",
    municipios: [
      "Álvaro Obregón",
      "Azcapotzalco",
      "Benito Juárez",
      "Coyoacán",
      "Cuajimalpa de Morelos",
      "Cuauhtémoc",
      "Gustavo A. Madero",
      "Iztacalco",
      "Iztapalapa",
      "La Magdalena Contreras",
      "Miguel Hidalgo",
      "Milpa Alta",
      "Tláhuac",
      "Tlalpan",
      "Venustiano Carranza",
      "Xochimilco",
    ],
  },
  {
    nombre: "Jalisco",
    municipios: ["Guadalajara", "Zapopan", "Tlaquepaque", "Tonalá", "Tlajomulco de Zúñiga"],
  },
  {
    nombre: "Nuevo León",
    municipios: ["Monterrey", "Guadalupe", "Apodaca", "San Pedro Garza García", "San Nicolás de los Garza"],
  },
  {
    nombre: "Estado de México",
    municipios: ["Ecatepec de Morelos", "Nezahualcóyotl", "Naucalpan de Juárez", "Tlalnepantla de Baz", "Toluca"],
  }
];
