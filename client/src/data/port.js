const allPorts = [

  // =========================
  // DEPART DUBAI
  // =========================

  {
    name: "Port de Jebel Ali",
    country: "Émirats Arabes Unis",
    region: "Dubai",
    coordinates:{
      lat:25.01126,
      lng:55.06116
    }
  },


  // =========================
  // MER ROUGE / CORNE AFRIQUE
  // =========================

  {
    name:"Port de Djibouti",
    country:"Djibouti",
    coordinates:{
      lat:11.595,
      lng:43.148
    }
  },


  {
    name:"Port de Berbera",
    country:"Somaliland",
    coordinates:{
      lat:10.441,
      lng:45.014
    }
  },


  {
    name:"Port de Mombasa",
    country:"Kenya",
    coordinates:{
      lat:-4.0435,
      lng:39.6682
    }
  },


  {
    name:"Port de Dar es Salaam",
    country:"Tanzanie",
    coordinates:{
      lat:-6.7924,
      lng:39.2083
    }
  },


  {
    name:"Port de Zanzibar",
    country:"Tanzanie",
    coordinates:{
      lat:-6.1659,
      lng:39.2026
    }
  },


  {
    name:"Port de Maputo",
    country:"Mozambique",
    coordinates:{
      lat:-25.9692,
      lng:32.5732
    }
  },


  {
    name:"Port de Beira",
    country:"Mozambique",
    coordinates:{
      lat:-19.8436,
      lng:34.8389
    }
  },


  {
    name:"Port de Durban",
    country:"Afrique du Sud",
    coordinates:{
      lat:-29.8587,
      lng:31.0218
    }
  },


  {
    name:"Port Elizabeth",
    country:"Afrique du Sud",
    coordinates:{
      lat:-33.9608,
      lng:25.6022
    }
  },


  {
    name:"Port du Cap",
    country:"Afrique du Sud",
    coordinates:{
      lat:-33.9189,
      lng:18.4233
    }
  },


  {
    name:"Port de Walvis Bay",
    country:"Namibie",
    coordinates:{
      lat:-22.9576,
      lng:14.5053
    }
  },


  // =========================
  // AFRIQUE OUEST
  // =========================


  {
    name:"Port de Luanda",
    country:"Angola",
    coordinates:{
      lat:-8.8383,
      lng:13.2344
    }
  },


  {
    name:"Port de Pointe-Noire",
    country:"République du Congo",
    coordinates:{
      lat:-4.7692,
      lng:11.8664
    }
  },


  {
    name:"Port de Libreville",
    country:"Gabon",
    coordinates:{
      lat:0.4162,
      lng:9.4673
    }
  },
  // ==========================

  {
    name: "Port de Banana",
    country: "République Démocratique du Congo",
    type: "maritime",
    coordinates: {
      lat: -6.02,
      lng: 12.42
    }
  },


  {
    name: "Port de Boma",
    country: "République Démocratique du Congo",
    type: "fluvial",
    coordinates: {
      lat: -5.85,
      lng: 13.05
    }
  },


  {
    name: "Port de Matadi",
    country: "République Démocratique du Congo",
    type: "fluvial",
    coordinates: {
      lat: -5.816,
      lng: 13.45
    }
  },


  {
    name: "Port de Kinshasa",
    country: "République Démocratique du Congo",
    type: "fluvial",
    coordinates: {
      lat: -4.322,
      lng: 15.312
    }
  },


  {
    name: "Port de Kisangani",
    country: "République Démocratique du Congo",
    type: "fluvial",
    coordinates: {
      lat: 0.515,
      lng: 25.191
    }
  },



  {
    name:"Port de Kribi",
    country:"Cameroun",
    coordinates:{
      lat:2.9375,
      lng:9.907
    }
  },


  {
    name:"Port de Douala",
    country:"Cameroun",
    coordinates:{
      lat:4.0511,
      lng:9.7679
    }
  },


  {
    name:"Port de Lagos",
    country:"Nigeria",
    coordinates:{
      lat:6.455,
      lng:3.3841
    }
  },


  {
    name:"Port de Tema",
    country:"Ghana",
    coordinates:{
      lat:5.6698,
      lng:0.0166
    }
  },


  {
    name:"Port d'Abidjan",
    country:"Côte d'Ivoire",
    coordinates:{
      lat:5.3097,
      lng:-4.0127
    }
  },

  // Ports supplémentaires de la Côte d'Ivoire
  {
    name: "Port de San-Pedro",
    country: "Côte d'Ivoire",
    coordinates: {
      lat: 4.7458,
      lng: -6.6413
    }
  },

  {
    name: "Port de Sassandra",
    country: "Côte d'Ivoire",
    coordinates: {
      lat: 4.9500,
      lng: -6.6667
    }
  },

  // Ports de la Guinée (Conakry et côtiers)
  {
    name: "Port autonome de Conakry",
    country: "Guinée",
    coordinates: {
      lat: 9.5456,
      lng: -13.6810
    }
  },

  {
    name: "Port de Kamsar",
    country: "Guinée",
    coordinates: {
      lat: 10.6692,
      lng: -14.6301
    }
  },

  {
    name: "Port de Boké",
    country: "Guinée",
    coordinates: {
      lat: 10.9400,
      lng: -14.3019
    }
  },

  {
    name: "Port de Sangarédi",
    country: "Guinée",
    coordinates: {
      lat: 11.0600,
      lng: -13.8833
    }
  },

  {
    name: "Port de Coyah (terminal proche Conakry)",
    country: "Guinée",
    coordinates: {
      lat: 9.7167,
      lng: -13.5333
    }
  },


  {
    name:"Port de Dakar",
    country:"Sénégal",
    coordinates:{
      lat:14.7167,
      lng:-17.4677
    }
  },


  {
    name:"Port de Tanger Med",
    country:"Maroc",
    coordinates:{
      lat:35.8806,
      lng:-5.5
    }
  },
  { name: "Port de Nouakchott", country: "Mauritanie", coordinates: { lat: 18.095, lng: -15.978 } },
  { name: "Port de Banjul", country: "Gambie", coordinates: { lat: 13.454, lng: -16.579 } },
  { name: "Port de Freetown", country: "Sierra Leone", coordinates: { lat: 8.495, lng: -13.715 } },
  { name: "Port de Monrovia", country: "Liberia", coordinates: { lat: 6.300, lng: -10.800 } },
  { name: "Port de Takoradi", country: "Ghana", coordinates: { lat: 4.884, lng: -1.752 } },
  { name: "Port Autonome de Lome", country: "Togo", coordinates: { lat: 6.126, lng: 1.225 } },
  { name: "Port de Cotonou", country: "Benin", coordinates: { lat: 6.360, lng: 2.419 } },
  { name: "Port de Port Harcourt", country: "Nigeria", coordinates: { lat: 4.815, lng: 7.049 } },
  { name: "Port de Calabar", country: "Nigeria", coordinates: { lat: 4.975, lng: 8.342 } },
  { name: "Port de Malabo", country: "Guinee equatoriale", coordinates: { lat: 3.752, lng: 8.783 } },
  { name: "Port de Sao Tome", country: "Sao Tome-et-Principe", coordinates: { lat: 0.337, lng: 6.731 } },
  { name: "Port de Lobito", country: "Angola", coordinates: { lat: -12.348, lng: 13.546 } },
  { name: "Port de Port Soudan", country: "Soudan", coordinates: { lat: 19.615, lng: 37.216 } },
  { name: "Port d'Alexandrie", country: "Egypte", coordinates: { lat: 31.201, lng: 29.888 } },
  { name: "Port de Casablanca", country: "Maroc", coordinates: { lat: 33.604, lng: -7.617 } },
  { name: "Port d'Alger", country: "Algerie", coordinates: { lat: 36.753, lng: 3.059 } },
  { name: "Port de Tunis", country: "Tunisie", coordinates: { lat: 36.819, lng: 10.305 } },
  { name: "Port de Tripoli", country: "Libye", coordinates: { lat: 32.887, lng: 13.191 } }
];

// Une seule destination proposée pour la RDC, la Guinée, la Côte d'Ivoire et le Togo.
const portsToHide = new Set([
  "Port de Boma",
  "Port de Matadi",
  "Port de Kinshasa",
  "Port de Kisangani",
  "Port de Kamsar",
  "Port de Boké",
  "Port de Sangarédi",
  "Port de Coyah (terminal proche Conakry)",
  "Port de San-Pedro",
  "Port de Sassandra",
]);

const portsToKeepAll = new Set([
  "Port de Banana",
  "Port de Boma",
  "Port de Matadi",
  "Port de Kinshasa",
  "Port de Kisangani",
  "Port d'Abidjan",
  "Port de San-Pedro",
  "Port de Sassandra",
  "Port autonome de Conakry",
  "Port de Kamsar",
  "Port de Boké",
  "Port de Sangarédi",
  "Port de Coyah (terminal proche Conakry)",
  "Port Autonome de Lome",
]);

const displayedCountries = new Set();

export const ports = allPorts.filter((port) => {
  if (portsToKeepAll.has(port.name)) return true;
  if (displayedCountries.has(port.country)) return false;
  displayedCountries.add(port.country);
  return true;
});
