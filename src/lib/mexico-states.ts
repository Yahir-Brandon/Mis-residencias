
export type State = {
  nombre: string;
  municipios: string[];
};

export const mexicoStates: State[] = [
  {
    nombre: "Aguascalientes",
    municipios: [
      "Aguascalientes", "Asientos", "Calvillo", "Cosío", "Jesús María",
      "Pabellón de Arteaga", "Rincón de Romos", "San José de Gracia",
      "Tepezalá", "El Llano", "San Francisco de los Romo",
    ],
  },
  {
    nombre: "Baja California",
    municipios: ["Ensenada", "Mexicali", "Tecate", "Tijuana", "Playas de Rosarito", "San Quintín"],
  },
  {
    nombre: "Baja California Sur",
    municipios: ["Comondú", "Mulegé", "La Paz", "Los Cabos", "Loreto"],
  },
  {
    nombre: "Campeche",
    municipios: [
      "Calkiní", "Campeche", "Carmen", "Champotón", "Hecelchakán",
      "Hopelchén", "Palizada", "Tenabo", "Escárcega", "Calakmul", "Candelaria",
    ],
  },
  {
    nombre: "Coahuila de Zaragoza",
    municipios: [
        "Abasolo", "Acuña", "Allende", "Arteaga", "Candela", "Castaños", "Cuatro Ciénegas", "Escobedo", "Francisco I. Madero", "Frontera", "General Cepeda", "Guerrero", "Hidalgo", "Jiménez", "Juárez", "Lamadrid", "Matamoros", "Monclova", "Morelos", "Múzquiz", "Nadadores", "Nava", "Ocampo", "Parras", "Piedras Negras", "Progreso", "Ramos Arizpe", "Sabinas", "Sacramento", "Saltillo", "San Buenaventura", "San Juan de Sabinas", "San Pedro", "Sierra Mojada", "Torreón", "Viesca", "Villa Unión", "Zaragoza",
    ],
  },
  {
    nombre: "Colima",
    municipios: [
      "Armería", "Colima", "Comala", "Coquimatlán", "Cuauhtémoc",
      "Ixtlahuacán", "Manzanillo", "Minatitlán", "Tecomán", "Villa de Álvarez",
    ],
  },
  {
    nombre: "Chiapas",
    municipios: [
        "Acacoyagua", "Acala", "Acapetahua", "Altamirano", "Amatán", "Amatenango de la Frontera", "Amatenango del Valle", "Angel Albino Corzo", "Arriaga", "Bejucal de Ocampo", "Bella Vista", "Berriozábal", "Bochil", "El Bosque", "Cacahoatán", "Catazajá", "Cintalapa", "Coapilla", "Comitán de Domínguez", "La Concordia", "Copainalá", "Chalchihuitán", "Chamula", "Chanal", "Chapultenango", "Chenalhó", "Chiapa de Corzo", "Chiapilla", "Chicoasén", "Chicomuselo", "Chilón", "Escuintla", "Francisco León", "Frontera Comalapa", "Frontera Hidalgo", "La Grandeza", "Huehuetán", "Huixtán", "Huitiupán", "Huixtla", "La Independencia", "Ixhuatán", "Ixtacomitán", "Ixtapa", "Ixtapangajoya", "Jiquipilas", "Jitotol", "Juárez", "Larráinzar", "La Libertad", "Mapastepec", "Las Margaritas", "Mazapa de Madero", "Mazatán", "Metapa", "Mitontic", "Motozintla", "Nicolás Ruíz", "Ocosingo", "Ocotepec", "Ocozocoautla de Espinosa", "Ostuacán", "Osumacinta", "Oxchuc", "Palenque", "Pantelhó", "Pantepec", "Pichucalco", "Pijijiapan", "El Porvenir", "Villa Comaltitlán", "Pueblo Nuevo Solistahuacán", "Rayón", "Reforma", "Las Rosas", "Sabanilla", "Salto de Agua", "San Cristóbal de las Casas", "San Fernando", "Siltepec", "Simojovel", "Sitalá", "Socoltenango", "Solosuchiapa", "Soyaló", "Suchiapa", "Suchiate", "Sunuapa", "Tapachula", "Tapalapa", "Tapilula", "Tecpatán", "Tenejapa", "Teopisca", "Tila", "Tonalá", "Totolapa", "La Trinitaria", "Tumbalá", "Tuxtla Gutiérrez", "Tuxtla Chico", "Tuzantán", "Tzimol", "Unión Juárez", "Venustiano Carranza", "Villa Corzo", "Villaflores", "Yajalón", "San Lucas", "Zinacantán", "San Juan Cancuc", "Aldama", "Benemérito de las Américas", "Maravilla Tenejapa", "Marqués de Comillas", "Montecristo de Guerrero", "San Andrés Duraznal", "Santiago el Pinar",
    ],
  },
  {
    nombre: "Chihuahua",
    municipios: [
        "Ahumada", "Aldama", "Allende", "Aquiles Serdán", "Ascensión", "Bachíniva", "Balleza", "Batopilas", "Bocoyna", "Buenaventura", "Camargo", "Carichí", "Casas Grandes", "Coronado", "Coyame del Sotol", "La Cruz", "Cuauhtémoc", "Cusihuiriachi", "Chihuahua", "Chínipas", "Delicias", "Dr. Belisario Domínguez", "Galeana", "Santa Isabel", "Gómez Farías", "Gran Morelos", "Guachochi", "Guadalupe", "Guadalupe y Calvo", "Guazapares", "Guerrero", "Hidalgo del Parral", "Huejotitán", "Ignacio Zaragoza", "Janos", "Jiménez", "Juárez", "Julimes", "López", "Madera", "Maguarichi", "Manuel Benavides", "Matachí", "Matamoros", "Meoqui", "Morelos", "Moris", "Namiquipa", "Nonoava", "Nuevo Casas Grandes", "Ocampo", "Ojinaga", "Praxedis G. Guerrero", "Riva Palacio", "Rosales", "Rosario", "San Francisco de Borja", "San Francisco de Conchos", "San Francisco del Oro", "Santa Bárbara", "Satevó", "Saucillo", "Temósachic", "El Tule", "Urique", "Uruachi", "Valle de Zaragoza",
    ],
  },
  {
    nombre: "Ciudad de México",
    municipios: [
      "Álvaro Obregón", "Azcapotzalco", "Benito Juárez", "Coyoacán",
      "Cuajimalpa de Morelos", "Cuauhtémoc", "Gustavo A. Madero", "Iztacalco",
      "Iztapalapa", "La Magdalena Contreras", "Miguel Hidalgo", "Milpa Alta",
      "Tláhuac", "Tlalpan", "Venustiano Carranza", "Xochimilco",
    ],
  },
  {
    nombre: "Durango",
    municipios: [
        "Canatlán", "Canelas", "Coneto de Comonfort", "Cuencamé", "Durango", "General Simón Bolívar", "Gómez Palacio", "Guadalupe Victoria", "Guanaceví", "Hidalgo", "Indé", "Lerdo", "Mapimí", "Mezquital", "Nazas", "Nombre de Dios", "Ocampo", "El Oro", "Otáez", "Pánuco de Coronado", "Peñón Blanco", "Poanas", "Pueblo Nuevo", "Rodeo", "San Bernardo", "San Dimas", "San Juan de Guadalupe", "San Juan del Río", "San Luis del Cordero", "San Pedro del Gallo", "Santa Clara", "Santiago Papasquiaro", "Súchil", "Tamazula", "Tepehuanes", "Tlahualilo", "Topia", "Vicente Guerrero", "Nuevo Ideal",
    ],
  },
  {
    nombre: "Guanajuato",
    municipios: [
        "Abasolo", "Acámbaro", "San Miguel de Allende", "Apaseo el Alto", "Apaseo el Grande", "Atarjea", "Celaya", "Manuel Doblado", "Comonfort", "Coroneo", "Cortazar", "Cuerámaro", "Doctor Mora", "Dolores Hidalgo Cuna de la Independencia Nacional", "Guanajuato", "Huanímaro", "Irapuato", "Jaral del Progreso", "Jerécuaro", "León", "Moroleón", "Ocampo", "Pénjamo", "Pueblo Nuevo", "Purísima del Rincón", "Romita", "Salamanca", "Salvatierra", "San Diego de la Unión", "San Felipe", "San Francisco del Rincón", "San José Iturbide", "San Luis de la Paz", "Santa Catarina", "Santa Cruz de Juventino Rosas", "Santiago Maravatío", "Silao de la Victoria", "Tarandacuao", "Tarimoro", "Tierra Blanca", "Uriangato", "Valle de Santiago", "Victoria", "Villagrán", "Xichú", "Yuriria",
    ],
  },
  {
    nombre: "Guerrero",
    municipios: [
        "Acapulco de Juárez", "Ahuacuotzingo", "Ajuchitlán del Progreso", "Alcozauca de Guerrero", "Alpoyeca", "Apaxtla", "Arcelia", "Atenango del Río", "Atlamajalcingo del Monte", "Atlixtac", "Atoyac de Álvarez", "Ayutla de los Libres", "Azoyú", "Benito Juárez", "Buenavista de Cuéllar", "Coahuayutla de José María Izazaga", "Cocula", "Copala", "Copalillo", "Copanatoyac", "Coyuca de Benítez", "Coyuca de Catalán", "Cuajinicuilapa", "Cualác", "Cuautepec", "Cuetzala del Progreso", "Cutzamala de Pinzón", "Chilapa de Álvarez", "Chilpancingo de los Bravo", "Florencio Villarreal", "General Canuto A. Neri", "General Heliodoro Castillo", "Huamuxtitlán", "Huitzuco de los Figueroa", "Iguala de la Independencia", "Igualapa", "Ixcateopan de Cuauhtémoc", "Zihuatanejo de Azueta", "Juan R. Escudero", "Leonardo Bravo", "Malinaltepec", "Mártir de Cuilapan", "Metlatónoc", "Mochitlán", "Olinalá", "Ometepec", "Pedro Ascencio Alquisiras", "Petatlán", "Pilcaya", "Pungarabato", "Quechultenango", "San Luis Acatlán", "San Marcos", "San Miguel Totolapan", "Taxco de Alarcón", "Tecoanapa", "Técpan de Galeana", "Teloloapan", "Tepecoacuilco de Trujano", "Tetipac", "Tixtla de Guerrero", "Tlacoachistlahuaca", "Tlacoapa", "Tlalchapa", "Tlalixtaquilla de Maldonado", "Tlapa de Comonfort", "Tlapehuala", "La Unión de Isidoro Montes de Oca", "Xalpatláhuac", "Xochihuehuetlán", "Xochistlahuaca", "Zapotitlán Tablas", "Zirándaro", "Zitlala", "Eduardo Neri", "Acatepec", "Marquelia", "Cochoapa el Grande", "José Joaquín de Herrera", "Juchitán", "Iliatenco",
    ],
  },
  {
    nombre: "Hidalgo",
    municipios: [
        "Acatlán", "Acaxochitlán", "Actopan", "Agua Blanca de Iturbide", "Ajacuba", "Alfajayucan", "Almoloya", "Apan", "El Arenal", "Atitalaquia", "Atlapexco", "Atotonilco el Grande", "Atotonilco de Tula", "Calnali", "Cardonal", "Cuautepec de Hinojosa", "Chapantongo", "Chapulhuacán", "Chilcuautla", "Eloxochitlán", "Emiliano Zapata", "Epazoyucan", "Francisco I. Madero", "Huasca de Ocampo", "Huautla", "Huazalingo", "Huehuetla", "Huejutla de Reyes", "Huichapan", "Ixmiquilpan", "Jacala de Ledezma", "Jaltocán", "Juárez Hidalgo", "Lolotla", "Metepec", "San Agustín Metzquititlán", "Metztitlán", "Mineral del Chico", "Mineral del Monte", "La Misión", "Mixquiahuala de Juárez", "Molango de Escamilla", "Nicolás Flores", "Nopala de Villagrán", "Omitlán de Juárez", "San Felipe Orizatlán", "Pacula", "Pachuca de Soto", "Pisaflores", "Progreso de Obregón", "Mineral de la Reforma", "San Agustín Tlaxiaca", "San Bartolo Tutotepec", "San Salvador", "Santiago de Anaya", "Santiago Tulantepec de Lugo Guerrero", "Singuilucan", "Tasquillo", "Tecozautla", "Tenango de Doria", "Tepeapulco", "Tepehuacán de Guerrero", "Tepeji del Río de Ocampo", "Tepetitlán", "Tetepango", "Villa de Tezontepec", "Tezontepec de Aldama", "Tianguistengo", "Tizayuca", "Tlahuelilpan", "Tlahuiltepa", "Tlanalapa", "Tlanchinol", "Tlaxcoapan", "Tolcayuca", "Tula de Allende", "Tulancingo de Bravo", "Xochiatipan", "Xochicoatlán", "Yahualica", "Zacualtipán de Ángeles", "Zapotlán de Juárez", "Zempoala", "Zimapán",
    ],
  },
  {
    nombre: "Jalisco",
    municipios: [
        "Acatic", "Acatlán de Juárez", "Ahualulco de Mercado", "Amacueca", "Amatitán", "Ameca", "San Juanito de Escobedo", "Arandas", "El Arenal", "Atemajac de Brizuela", "Atengo", "Atenguillo", "Atotonilco el Alto", "Atoyac", "Autlán de Navarro", "Ayotlán", "Ayutla", "La Barca", "Bolaños", "Cabo Corrientes", "Casimiro Castillo", "Cihuatlán", "Zapotlán el Grande", "Cocula", "Colotlán", "Concepción de Buenos Aires", "Cuautitlán de García Barragán", "Cuautla", "Cuquío", "Chapala", "Chimaltitán", "Chiquilistlán", "Degollado", "Ejutla", "Encarnación de Díaz", "Etzatlán", "El Grullo", "Guachinango", "Guadalajara", "Hostotipaquillo", "Huejúcar", "Huejuquilla el Alto", "La Huerta", "Ixtlahuacán de los Membrillos", "Ixtlahuacán del Río", "Jalostotitlán", "Jamay", "Jesús María", "Jilotlán de los Dolores", "Jocotepec", "Juanacatlán", "Juchitlán", "Lagos de Moreno", "El Limón", "Magdalena", "Santa María del Oro", "La Manzanilla de la Paz", "Mascota", "Mazamitla", "Mexticacán", "Mezquitic", "Mixtlán", "Ocotlán", "Ojuelos de Jalisco", "Pihuamo", "Poncitlán", "Puerto Vallarta", "Villa Purificación", "Quitupan", "El Salto", "San Cristóbal de la Barranca", "San Diego de Alejandría", "San Juan de los Lagos", "San Julián", "San Marcos", "San Martín de Bolaños", "San Martín Hidalgo", "San Miguel el Alto", "Gómez Farías", "San Sebastián del Oeste", "Santa María de los Ángeles", "Sayula", "Tala", "Talpa de Allende", "Tamazula de Gordiano", "Tapalpa", "Tecalitlán", "Tecolotlán", "Techaluta de Montenegro", "Tenamaxtlán", "Teocaltiche", "Teocuitatlán de Corona", "Tepatitlán de Morelos", "Tequila", "Teuchitlán", "Tizapán el Alto", "Tlajomulco de Zúñiga", "San Pedro Tlaquepaque", "Tolimán", "Tomatlán", "Tonalá", "Tonaya", "Tonila", "Totatiche", "Tototlán", "Tuxcacuesco", "Tuxcueca", "Tuxpan", "Unión de San Antonio", "Unión de Tula", "Valle de Guadalupe", "Valle de Juárez", "San Gabriel", "Villa Corona", "Villa Guerrero", "Villa Hidalgo", "Cañadas de Obregón", "Yahualica de González Gallo", "Zacoalco de Torres", "Zapopan", "Zapotiltic", "Zapotitlán de Vadillo", "Zapotlán del Rey", "Zapotlanejo", "San Ignacio Cerro Gordo",
    ],
  },
  {
    nombre: "Estado de México",
    municipios: [
        "Acambay de Ruíz Castañeda", "Acolman", "Aculco", "Almoloya de Alquisiras", "Almoloya de Juárez", "Almoloya del Río", "Amanalco", "Amatepec", "Amecameca", "Apaxco", "Atenco", "Atizapán", "Atizapán de Zaragoza", "Atlacomulco", "Atlautla", "Axapusco", "Ayapango", "Calimaya", "Capulhuac", "Coacalco de Berriozábal", "Coatepec Harinas", "Cocotitlán", "Coyotepec", "Cuautitlán", "Chalco", "Chapa de Mota", "Chapultepec", "Chiautla", "Chicoloapan", "Chiconcuac", "Chimalhuacán", "Donato Guerra", "Ecatepec de Morelos", "Ecatzingo", "Huehuetoca", "Hueypoxtla", "Huixquilucan", "Isidro Fabela", "Ixtapaluca", "Ixtapan de la Sal", "Ixtapan del Oro", "Ixtlahuaca", "Xalatlaco", "Jaltenco", "Jilotepec", "Jilotzingo", "Jiquipilco", "Jocotitlán", "Joquicingo", "Juchitepec", "Lerma", "Malinalco", "Melchor Ocampo", "Metepec", "Mexicaltzingo", "Morelos", "Naucalpan de Juárez", "Nezahualcóyotl", "Nextlalpan", "Nicolás Romero", "Nopaltepec", "Ocoyoacac", "Ocuilan", "El Oro", "Otumba", "Otzoloapan", "Otzolotepec", "Ozumba", "Papalotla", "La Paz", "Polotitlán", "Rayón", "San Antonio la Isla", "San Felipe del Progreso", "San Martín de las Pirámides", "San Mateo Atenco", "San Simón de Guerrero", "Santo Tomás", "Soyaniquilpan de Juárez", "Sultepec", "Tecámac", "Tejupilco", "Temamatla", "Temascalapa", "Temascalcingo", "Temascaltepec", "Temoaya", "Tenancingo", "Tenango del Aire", "Tenango del Valle", "Teoloyucan", "Teotihuacán", "Tepetlaoxtoc", "Tepetlixpa", "Tepotzotlán", "Tequixquiac", "Texcaltitlán", "Texcalyacac", "Texcoco", "Tezoyuca", "Tianguistenco", "Timilpan", "Tlalmanalco", "Tlalnepantla de Baz", "Tlatlaya", "Toluca", "Tonatico", "Tultepec", "Tultitlán", "Valle de Bravo", "Villa de Allende", "Villa del Carbón", "Villa Guerrero", "Villa Victoria", "Xonacatlán", "Zacazonapan", "Zacualpan", "Zinacantepec", "Zumpahuacán", "Zumpango", "Valle de Chalco Solidaridad", "Luvianos", "San José del Rincón", "Tonanitla"
    ],
  },
  {
    nombre: "Michoacán de Ocampo",
    municipios: [
        "Acuitzio", "Aguililla", "Álvaro Obregón", "Angamacutiro", "Angangueo", "Apatzingán", "Aporo", "Aquila", "Ario", "Arteaga", "Briseñas", "Buenavista", "Carácuaro", "Coahuayana", "Coalcomán de Vázquez Pallares", "Coeneo", "Contepec", "Copándaro", "Cotija", "Cuitzeo", "Charapan", "Charo", "Chavinda", "Cherán", "Chilchota", "Chinicuila", "Chucándiro", "Churintzio", "Churumuco", "Ecuandureo", "Epitacio Huerta", "Erongarícuaro", "Gabriel Zamora", "Hidalgo", "La Huacana", "Huandacareo", "Huaniqueo", "Huetamo", "Huiramba", "Indaparapeo", "Irimbo", "Ixtlán", "Jacona", "Jiménez", "Jiquilpan", "Juárez", "Jungapeo", "Lagunillas", "Madero", "Maravatío", "Marcos Castellanos", "Lázaro Cárdenas", "Morelia", "Morelos", "Múgica", "Nahuatzen", "Nocupétaro", "Nuevo Parangaricutiro", "Nuevo Urecho", "Numarán", "Ocampo", "Pajacuarán", "Panindícuaro", "Parácuaro", "Paracho", "Pátzcuaro", "Penjamillo", "Peribán", "La Piedad", "Purépero", "Puruándiro", "Queréndaro", "Quiroga", "Cojumatlán de Régules", "Los Reyes", "Sahuayo", "San Lucas", "Santa Ana Maya", "Salvador Escalante", "Senguio", "Susupuato", "Tacámbaro", "Tancítaro", "Tangamandapio", "Tangancícuaro", "Tanhuato", "Taretan", "Tarímbaro", "Tepalcatepec", "Tingambato", "Tingüindín", "Tiquicheo de Nicolás Romero", "Tlalpujahua", "Tlazazalca", "Tocumbo", "Tumbiscatío", "Turicato", "Tuxpan", "Tuzantla", "Tzintzuntzan", "Tzitzio", "Uruapan", "Venustiano Carranza", "Villamar", "Vista Hermosa", "Yurécuaro", "Zacapu", "Zamora", "Zináparo", "Zinapécuaro", "Ziracuaretiro", "Zitácuaro", "José Sixto Verduzco"
    ],
  },
  {
    nombre: "Morelos",
    municipios: [
        "Amacuzac", "Atlatlahucan", "Axochiapan", "Ayala", "Coatlán del Río", "Cuautla", "Cuernavaca", "Emiliano Zapata", "Huitzilac", "Jantetelco", "Jiutepec", "Jojutla", "Jonacatepec", "Mazatepec", "Miacatlán", "Ocuituco", "Puente de Ixtla", "Temixco", "Tepalcingo", "Tepoztlán", "Tetecala", "Tetela del Volcán", "Tlalnepantla", "Tlaltizapán de Zapata", "Tlaquiltenango", "Tlayacapan", "Totolapan", "Xochitepec", "Yautepec", "Yecapixtla", "Zacatepec", "Zacualpan de Amilpas", "Temoac", "Coatetelco", "Xoxocotla", "Hueyapan"
    ],
  },
  {
    nombre: "Nayarit",
    municipios: [
        "Acaponeta", "Ahuacatlán", "Amatlán de Cañas", "Compostela", "Huajicori", "Ixtlán del Río", "Jala", "Xalisco", "Del Nayar", "Rosamorada", "Ruíz", "San Blas", "San Pedro Lagunillas", "Santa María del Oro", "Santiago Ixcuintla", "Tecuala", "Tepic", "Tuxpan", "La Yesca", "Bahía de Banderas"
    ],
  },
  {
    nombre: "Nuevo León",
    municipios: [
        "Abasolo", "Agualeguas", "Los Aldamas", "Allende", "Anáhuac", "Apodaca", "Aramberri", "Bustamante", "Cadereyta Jiménez", "El Carmen", "Cerralvo", "Ciénega de Flores", "China", "Doctor Arroyo", "Doctor Coss", "Doctor González", "Galeana", "García", "San Pedro Garza García", "General Bravo", "General Escobedo", "General Terán", "General Treviño", "General Zaragoza", "Guadalupe", "Los Herreras", "Higueras", "Hualahuises", "Iturbide", "Juárez", "Lampazos de Naranjo", "Linares", "Marín", "Melchor Ocampo", "Mier y Noriega", "Mina", "Montemorelos", "Monterrey", "Parás", "Pesquería", "Los Ramones", "Rayones", "Sabinas Hidalgo", "Salinas Victoria", "San Nicolás de los Garza", "Hidalgo", "Santa Catarina", "Santiago", "Vallecillo", "Villaldama"
    ],
  },
  {
    nombre: "Oaxaca",
    municipios: [
      "Abejones", "Acatlán de Pérez Figueroa", "Asunción Cacalotepec", "Asunción Cuyotepeji", "Asunción Ixtaltepec", "Asunción Nochixtlán", "Asunción Ocotlán", "Asunción Tlacolulita", "Ayotzintepec", "El Barrio de la Soledad", "Calihualá", "Candelaria Loxicha", "Ciénega de Zimatlán", "Ciudad Ixtepec", "Coatecas Altas", "Coicoyán de las Flores", "La Compañía", "Concepción Buenavista", "Concepción Pápalo", "Constancia del Rosario", "Cosolapa", "Cosoltepec", "Cuilápam de Guerrero", "Cuyamecalco Villa de Zaragoza", "Chahuites", "Chalcatongo de Hidalgo", "Chiquihuitlán de Benito Juárez", "Heroica Ciudad de Ejutla de Crespo", "Eloxochitlán de Flores Magón", "El Espinal", "Tamazulápam del Espíritu Santo", "Fresnillo de Trujano", "Guadalupe Etla", "Guadalupe de Ramírez", "Guelatao de Juárez", "Guevea de Humboldt", "Mesones Hidalgo", "Heroica Ciudad de Huajuapan de León", "Huautepec", "Huautla de Jiménez", "Ixtlán de Juárez", "Heroica Ciudad de Juchitán de Zaragoza", "Loma Bonita", "Magdalena Apasco", "Magdalena Jaltepec", "Santa Magdalena Jicotlán", "Magdalena Mixtepec", "Magdalena Ocotlán", "Magdalena Peñasco", "Magdalena Teitipac", "Magdalena Tequisistlán", "Magdalena Tlacotepec", "Magdalena Zahuatlán", "Mariscala de Juárez", "Mártires de Tacubaya", "Matías Romero Avendaño", "Mazatlán Villa de Flores", "Miahuatlán de Porfirio Díaz", "Mixistlán de la Reforma", "Monjas", "Natividad", "Nazareno Etla", "Nejapa de Madero", "Ixpantepec Nieves", "Santiago Niltepec", "Oaxaca de Juárez"
    ]
  },
  {
    nombre: "Puebla",
    municipios: [
      "Puebla", "Tehuacán", "San Martín Texmelucan", "Atlixco", "San Pedro Cholula", "Amozoc", "Huauchinango", "Teziutlán"
    ],
  },
  {
    nombre: "Querétaro",
    municipios: [
      "Querétaro", "San Juan del Río", "Corregidora", "El Marqués", "Tequisquiapan", "Cadereyta de Montes", "Ezequiel Montes", "Colón"
    ],
  },
  {
    nombre: "Quintana Roo",
    municipios: [
      "Othón P. Blanco", "Benito Juárez", "Solidaridad", "Cozumel", "Felipe Carrillo Puerto", "Isla Mujeres", "José María Morelos", "Lázaro Cárdenas", "Tulum", "Bacalar", "Puerto Morelos"
    ],
  },
  {
    nombre: "San Luis Potosí",
    municipios: [
      "San Luis Potosí", "Soledad de Graciano Sánchez", "Ciudad Valles", "Matehuala", "Rioverde", "Tamazunchale", "Mexquitic de Carmona"
    ],
  },
  {
    nombre: "Sinaloa",
    municipios: [
      "Culiacán", "Mazatlán", "Ahome", "Guasave", "Navolato", "Salvador Alvarado", "El Fuerte", "Escuinapa"
    ],
  },
  {
    nombre: "Sonora",
    municipios: [
      "Hermosillo", "Cajeme", "Nogales", "San Luis Río Colorado", "Navojoa", "Guaymas", "Agua Prieta", "Caborca"
    ],
  },
  {
    nombre: "Tabasco",
    municipios: [
      "Centro", "Cárdenas", "Comalcalco", "Huimanguillo", "Macuspana", "Cunduacán", "Paraíso", "Tenosique"
    ],
  },
  {
    nombre: "Tamaulipas",
    municipios: [
      "Reynosa", "Matamoros", "Nuevo Laredo", "Tampico", "Victoria", "Madero", "Altamira", "Río Bravo"
    ],
  },
  {
    nombre: "Tlaxcala",
    municipios: [
      "Tlaxcala", "Apizaco", "Huamantla", "Chiautempan", "Zacatelco", "Calpulalpan", "San Pablo del Monte"
    ],
  },
  {
    nombre: "Veracruz de Ignacio de la Llave",
    municipios: [
      "Veracruz", "Xalapa", "Coatzacoalcos", "Poza Rica de Hidalgo", "Minatitlán", "Córdoba", "Orizaba", "Tuxpan"
    ],
  },
  {
    nombre: "Yucatán",
    municipios: [
      "Mérida", "Kanasín", "Valladolid", "Progreso", "Tizimín", "Umán", "Tekax", "Ticul"
    ],
  },
  {
    nombre: "Zacatecas",
    municipios: [
      "Zacatecas", "Fresnillo", "Guadalupe", "Jerez", "Río Grande", "Sombrerete", "Jalpa", "Villanueva"
    ],
  },
];
