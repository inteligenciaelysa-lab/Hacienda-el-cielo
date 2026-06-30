const { useState, useEffect, useRef } = React;

// ====== CONFIG (editable) ======
// Webhook para recibir reservaciones (Google Apps Script / Formspree). Vacío = no se usa.
const RESERVATION_WEBHOOK =
  "https://script.google.com/macros/s/AKfycbywLjQA4NeY-UA8scwxhnVNaRtuHtpoSGINkfKig9RaPfWkTGBGyBz3tLfJpsRMuBla/exec";
// Enlace de pago del anticipo (Stripe Payment Link / PayPal). Vacío hasta tenerlo.
const PAYMENT_LINK = "";
// Anticipo fijo (USD) requerido para reservar.
const DEPOSIT_FIXED = 7500;
// PIN para abrir el panel de reservaciones en #panel
const ADMIN_PIN = "1234";

// ============ TRANSLATIONS ============
const T = {
  es: {
    nav: {
      home: "Inicio",
      nature: "Cacería",
      hunt: "Cacería",
      hacienda: "Hacienda",
      hacienda_main: "La Hacienda",
      clubhouse: "Casa Club",
      suites: "Suites",
      dining: "Bar",
      kitchen: "Cocina",
      exterior: "Exterior",
      activities: "Actividades",
      about: "Historia",
      location: "Ubicación",
      contact: "Contacto",
      store: "Tienda",
      reserve: "Reservar",
      menu: "Menú",
      explore: "Explorar",
    },
    hero: {
      eyebrow: "Zaragoza · Coahuila · México",
      title1: "HACIENDA",
      title2: "EL CIELO",
      tagline:
        "Una experiencia de cacería de lujo entre majestuosas montañas mexicanas, vegetación abundante y trofeos legendarios — en la frontera más segura entre Texas y México.",
      cta1: "Reservar Estancia",
      cta2: "Descubrir Paquetes",
    },
    safety: {
      title: "La Frontera Más Segura",
      sub: "Zaragoza, Coahuila",
      stat1: "7",
      stat1_label: "Años consecutivos siendo la frontera más segura",
      stat2: "100 km",
      stat2_label: "Del Río Bravo · Sierra del Burro, Coahuila Norte",
      stat3: "Sierra",
      stat3_label: "Donde nace la Serranía del Burro · Naturaleza virgen",
      desc1:
        "Estamos a 100 km del Río Bravo, en el corazón de Coahuila Norte — la mejor zona de México para venado cola blanca. Piedras Negras lleva 7 años consecutivos siendo la frontera más segura entre México y Estados Unidos.",
      desc2:
        "Nuestra ubicación es estratégica: donde nace la majestuosa Serranía del Burro. Una región completamente virgen, llena de bosques, sierras, árboles centenarios y naturaleza pura.",
      how_title: "Cómo Llegar",
      how_desc:
        "Dos formas de llegar — por avión a uno de tres aeropuertos cercanos (Piedras Negras, Eagle Pass o Del Rio), o por carretera. Si llega en avión, nuestro equipo lo recoge directamente en el aeropuerto y lo lleva al hotel que seleccione en Piedras Negras (Hyatt Place o Hampton by Hilton), y al día siguiente al rancho. Todo el traslado está incluido.",
      by_car: "EN CARRO DESDE TEXAS A PIEDRAS NEGRAS Y SU HOTEL",
      dest_label: "Destino del hotel",
      by_air: "EN AVIÓN",
      car_transfer_note:
        "Desde su hotel en Piedras Negras lo trasladamos a la Hacienda en camioneta SUV — todo incluido, sin costos adicionales. Si prefiere venir en su propio vehículo al rancho, le recomendamos una troca (pick-up), jeep o cualquier vehículo 4x4, y solo siga a nuestro guía hasta la Hacienda.",
      transfer_label: "En camioneta SUV",
      transfer_note:
        "Si llega en avión a Piedras Negras, Eagle Pass o Del Rio, nuestro equipo lo recoge directamente en el aeropuerto y lo lleva al hotel que seleccione (Hyatt Place o Hampton by Hilton, en Piedras Negras). Al día siguiente lo llevamos al rancho. Todo incluido.",
      car_routes: [
        {
          city: "Eagle Pass, TX",
          time: "10 min",
          desc: "Cruce el puente internacional a Piedras Negras y diríjase a su hotel.",
          mapUrls: {
            hampton:
              "https://www.google.com/maps/dir/?api=1&origin=Eagle+Pass,+TX&destination=Hampton+by+Hilton+Piedras+Negras",
            hyatt:
              "https://www.google.com/maps/dir/?api=1&origin=Eagle+Pass,+TX&destination=Hyatt+Place+Piedras+Negras",
          },
        },
        {
          city: "San Antonio, TX",
          time: "2.5 hrs",
          desc: "Maneje hasta Eagle Pass y cruce a Piedras Negras a su hotel.",
          mapUrls: {
            hampton:
              "https://www.google.com/maps/dir/?api=1&origin=San+Antonio,+TX&destination=Hampton+by+Hilton+Piedras+Negras",
            hyatt:
              "https://www.google.com/maps/dir/?api=1&origin=San+Antonio,+TX&destination=Hyatt+Place+Piedras+Negras",
          },
        },
        {
          city: "Austin, TX",
          time: "4 hrs",
          desc: "Maneje al suroeste hacia Eagle Pass, cruce a Piedras Negras y diríjase a su hotel.",
          mapUrls: {
            hampton:
              "https://www.google.com/maps/dir/?api=1&origin=Austin,+TX&destination=Hampton+by+Hilton+Piedras+Negras",
            hyatt:
              "https://www.google.com/maps/dir/?api=1&origin=Austin,+TX&destination=Hyatt+Place+Piedras+Negras",
          },
        },
        {
          city: "Houston, TX",
          time: "5 hrs",
          desc: "Por la I-10 W hacia San Antonio, después al sur a Eagle Pass y Piedras Negras.",
          mapUrls: {
            hampton:
              "https://www.google.com/maps/dir/?api=1&origin=Houston,+TX&destination=Hampton+by+Hilton+Piedras+Negras",
            hyatt:
              "https://www.google.com/maps/dir/?api=1&origin=Houston,+TX&destination=Hyatt+Place+Piedras+Negras",
          },
        },
        {
          city: "Dallas, TX",
          time: "6 hrs",
          desc: "Por la I-35 S vía San Antonio hacia Eagle Pass y Piedras Negras.",
          mapUrls: {
            hampton:
              "https://www.google.com/maps/dir/?api=1&origin=Dallas,+TX&destination=Hampton+by+Hilton+Piedras+Negras",
            hyatt:
              "https://www.google.com/maps/dir/?api=1&origin=Dallas,+TX&destination=Hyatt+Place+Piedras+Negras",
          },
        },
        {
          city: "Monterrey, N.L.",
          time: "4-5 hrs",
          desc: "Por carretera federal hacia Piedras Negras y hasta su hotel.",
          mapUrls: {
            hampton:
              "https://www.google.com/maps/dir/?api=1&origin=Monterrey,+Nuevo+Leon&destination=Hampton+by+Hilton+Piedras+Negras",
            hyatt:
              "https://www.google.com/maps/dir/?api=1&origin=Monterrey,+Nuevo+Leon&destination=Hyatt+Place+Piedras+Negras",
          },
        },
      ],
      airports: [
        {
          name: "Aeropuerto de Del Rio (DRT)",
          desc: "Aeropuerto regional de Texas — traslado incluido al hotel en Piedras Negras y después al rancho.",
          mapUrl: "https://www.google.com/maps?q=29.3742,-100.9277&z=15",
        },
        {
          name: "Aeropuerto de Eagle Pass (EGP)",
          desc: "El más cercano del lado americano. Traslado incluido al hotel y después a la hacienda.",
          mapUrl: "https://www.google.com/maps?q=28.8627,-100.5152&z=15",
        },
        {
          name: "Aeropuerto de Piedras Negras (PDS)",
          desc: "Vuelos desde Monterrey y CDMX. Traslado incluido al hotel y al rancho.",
          mapUrl: "https://www.google.com/maps?q=28.6273,-100.5350&z=15",
        },
      ],
      hotel_title: "Recomendaciones de Hospedaje · Piedras Negras",
      hotel_desc:
        "Le recomendamos pasar la noche previa en Piedras Negras antes de venir al rancho. Dos excelentes opciones:",
      hotels: [
        {
          name: "Hampton by Hilton Piedras Negras",
          url: "https://www.hilton.com/en/locations/mexico/piedras-negras/hampton-by-hilton/?WT.mc_id=zlada0ww1hx2psh3ggl4advbpp5dkt6multibr7_153665317_1003528&gclsrc=aw.ds&gad_source=1&gad_campaignid=687014284&gbraid=0AAAAADQ3sJ16867bShqXxCYG_Wze4KpQM&gclid=CjwKCAjwidXQBhAZEiwA4egw6E6Oy_5A946w3sbxgcNOsvR_namhBrXoBNuzEOUcPLTrlPalHwTEwxoC9u4QAvD_BwE#",
        },
        {
          name: "Hyatt Place Piedras Negras",
          url: "https://www.hyatt.com/hyatt-place/es-ES/pdszp-hyatt-place-piedras-negras",
        },
      ],
      open_directions: "Abrir direcciones en Google Maps",
      open_in_maps: "Abrir en Google Maps",
      view_on_map: "Ver en mapa",
      view_in_maps: "Ver en Google Maps",
      recommended: "Recomendado",
      pin_hacienda_sub: "Zaragoza, Coahuila",
      pin_pds_sub: "Ciudad + Aeropuerto (PDS)",
      pin_egp_sub: "Ciudad + Aeropuerto (EGP)",
      pin_drt_sub: "Aeropuerto (DRT)",
    },
    nature: {
      eyebrow: "Cacería",
      title: "Naturaleza y Caza",
      desc: "Imponentes sierras mexicanas, encinos centenarios, mezquitales floridos y arroyos cristalinos componen nuestro alrededor.",
      card1: "Sierras Majestuosas",
      card1_d:
        "Cordilleras que se extienden hasta el horizonte, ofreciendo vistas que cortan el aliento.",
      card2: "Bosques Centenarios",
      card2_d:
        "Árboles enormes que han sido testigos del paso de generaciones de cazadores.",
      card3: "Vegetación Abundante",
      card3_d:
        "Un ecosistema próspero que sostiene una fauna excepcional durante todo el año.",
    },
    hunt: {
      eyebrow: "Cacería",
      title: "Trofeos de Leyenda",
      sub_trofeos: "Trofeos",
      garantia_title: "Garantía de Oportunidad",
      garantia_desc:
        "Si tras el disparo el animal queda herido y escapa, pero hay evidencia clara de impacto — sangre, pelo o hueso — se considera animal cazado. Un disparo que no conecta no cuenta como pieza.",
      desc: "Tres paquetes de caceria para cada nivel de exigencia, ademas de contar con una experiencia exclusiva para fotografos. Cada estancia incluye guía especializado, transporte interno y la garantía de experciencias extraordinarias.",
      photo_eyebrow: "Solo Fotografía",
      photo_title: "El Cazador Silencioso",
      photo_desc:
        "Para amantes de la naturaleza que prefieren capturar el momento con la cámara. Acceso completo a las áreas de avistamiento, guía y hospedaje incluidos. Sin cacería. Disponible todo el año.",
      photo_includes: [
        "Todo incluido (3 comidas + alcohol)",
        "↳ Hospedaje incluido",
        "↳ Guía incluido",
      ],
      photo_price: "$2,500",
      photo_price_unit: "USD",
      packages_title: "Paquetes de Cacería",
      booking_cta: "Solicitar Reservación",
      seasons: "Temporadas",
      season_deer: "Venado · Noviembre – Febrero",
      season_turkey: "Guajolote · Marzo – Mayo",
    },
    packages: [
      {
        name: "El Trono Dorado",
        sub: "Venado · Cerca Alta",
        price: "$15,500",
        unit: "USD",
        desc: "La experiencia más exclusiva. Acceso prioritario a nuestros venados de mayor calibre en nuestra Reserva de 500 hectáreas de cerca alta — donde se forjan los trofeos legendarios.",
        includes: [
          "Todo incluido (3 comidas + alcohol)",
          "↳ Hospedaje",
          "↳ Guía",
          "↳ 1 animal",
        ],
        deposit: 7500,
      },
      {
        name: "El Susurro del Monte",
        sub: "Venado · Cerca Baja",
        price: "$8,500",
        unit: "USD",
        desc: "Para el cazador que busca un trofeo honesto. Acceso a venados en zona de cerca baja, donde la astucia y la paciencia son tan importantes como la puntería.",
        includes: [
          "Todo incluido (3 comidas + alcohol)",
          "↳ Hospedaje",
          "↳ Guía",
          "↳ 1 animal",
        ],
        deposit: 7500,
      },
      {
        name: "Canto del Alba",
        sub: "Cacería de Guajolote",
        price: "$3,500",
        unit: "USD",
        desc: "Una experiencia centrada en el guajolote silvestre — uno de los desafíos más emocionantes de la cacería mexicana. Ideal para fines de semana memorables.",
        includes: [
          "Todo incluido (3 comidas + alcohol)",
          "↳ Hospedaje",
          "↳ Guía",
          "↳ 1 animal",
        ],
        deposit: 1500,
      },
    ],
    hacienda_section: {
      eyebrow: "La Hacienda",
      title: "Refugio de Cazadores",
      desc: "Una propiedad pensada para el cazador exigente: arquitectura tradicional mexicana, comodidades modernas y espacios para compartir.",
      subsections_label: "secciones para descubrir",
      tabs: {
        main: "La Hacienda",
        club: "Casa Club",
        suites: "Suites",
        food: "Bar",
        cocina: "Cocina",
        actividades: "Actividades",
      },
      main_desc:
        "El corazón de Hacienda El Cielo. Una construcción que honra la tradición coahuilense con detalles en piedra, madera y forjado a mano. Cada rincón cuenta una historia.",
      club_desc:
        "El bar de la Casa Club es donde nacen las mejores anécdotas. Whisky frente al fuego, mapas extendidos sobre la mesa, planes para el próximo amanecer.",
      suites_desc:
        "Seis suites únicas — Caymus, Opus, Seven, Storm, Petrus y Kratos — cada una bautizada en honor a un semental legendario. Diseñadas para el descanso profundo del cazador.",
      suites_features: [
        "2 camas (capacidad 4 personas)",
        "Baño privado con regadera",
        "Televisión",
        "WiFi",
        "Hospedaje incluido en los paquetes de caza",
      ],
      food_desc:
        "El bar de Hacienda El Cielo: vinos de la casa, whisky añejo y mezcales selectos. El lugar perfecto para brindar por la jornada y compartir las historias del día.",
      cocina_desc:
        "Cocina mexicana tradicional elevada. Productos locales, recetas familiares, ingredientes que solo crecen en estas tierras. Tres comidas diarias incluidas en cada paquete.",
      ext_desc:
        "Patios empedrados, fogones al aire libre, miradores con vista a la sierra. El exterior de la hacienda invita a vivir cada hora del día.",
      activities_eyebrow: "Actividades",
      activities_title: "Más Allá de la Cacería",
      act_desc:
        "Más allá de la cacería, Hacienda El Cielo ofrece experiencias que prolongan la aventura. Para cazadores, acompañantes y familias enteras.",
      activities: [
        {
          name: "Senderismo",
          desc: "Excursiones guiadas a los cerros y la Serranía del Burro, donde la naturaleza virgen revela sus secretos.",
        },
        {
          name: "Tiro al Plato (Shotgun)",
          desc: "Practique puntería con discos lanzados al aire. Diversión y entrenamiento al mismo tiempo.",
        },
        {
          name: "Pesca",
          desc: "Disfrute de jornadas tranquilas en ríos y arroyos — perfecto para acompañantes y niños.",
        },
        {
          name: "Juegos al Aire Libre",
          desc: "Clásicos juegos americanos al aire libre. Competencia amistosa frente al fuego con bebidas en mano.",
        },
        {
          name: "Fogatas y Cielos Estrellados",
          desc: "Las noches en Hacienda El Cielo son inolvidables. Cielos despejados, fogón crepitando, historias de cazadores.",
        },
        {
          name: "Avistamiento de Fauna",
          desc: "Para quienes prefieren observar — venados, guajolotes, osos negros, pájaros azules y especies endémicas en su hábitat natural.",
        },
      ],
    },
    suites: [
      {
        name: "Caymus",
        desc: "Nombrada en honor a Caymus — uno de nuestros sementales más imponentes, padre de generaciones de venados magníficos en estas sierras. Una suite para quien aspira a la grandeza.",
      },
      {
        name: "Kratos",
        desc: "Bautizada por el semental más colosal que ha pisado el rancho. Cuernos titánicos, presencia legendaria. Hospédese donde duermen los gigantes.",
      },
      {
        name: "Seven",
        desc: "El semental favorito del dueño — siete puntas perfectas, el número de la suerte. Cada cazador que se hospeda aquí siente esa misma fortuna acompañándolo al amanecer.",
      },
      {
        name: "Storm",
        desc: "El primer semental que llegó a Hacienda El Cielo — y con él, una tormenta espectacular bautizó la tierra ese mismo día. Aquí duerme la historia: donde todo empezó, donde el trueno marcó nuestro nombre.",
      },
      {
        name: "Petrus",
        desc: "Inspirada en Pétrus, el vino más codiciado del mundo. Le pusimos el nombre al mejor semental del rancho — porque algunos linajes solo se honran con los nombres más raros y deseados. Para el cazador que entiende lo que vale lo irrepetible.",
      },
      {
        name: "Opus",
        desc: "Como Opus One — uno de los vinos más prestigiosos de Estados Unidos. Un semental de elegancia indiscutible y genética excepcional. Esta suite celebra la cacería como obra maestra: precisión, paciencia, perfección.",
      },
    ],
    about: {
      eyebrow: "Historia",
      title: "Una Tradición Familiar",
      p1: "Hacienda El Cielo nace de la pasión de una familia coahuilense por la cacería ética, el respeto por la naturaleza y la hospitalidad mexicana. Llevamos décadas cuidando estas tierras y la fauna que las habita.",
      p2: "Creemos en una cacería responsable: poblaciones sanas, manejo profesional, guías expertos que conocen cada rincón de la propiedad. Cada huésped se convierte en parte de la familia.",
      p3: "Le invitamos a conocer un México distinto: seguro, hospitalario, generoso. El México de las sierras, de los amaneceres dorados, de las historias junto al fuego.",
      legacy:
        "Aquí la naturaleza permanece completamente virgen: más de 200 años sin ser explorada ni habitada por el hombre. Hacienda El Cielo fue fundada en 1930 a nombre de la histórica Hacienda San Miguel — tierra salvaje donde los venados han crecido libres y los trofeos se han forjado en silencio, generación tras generación.",
      est_label: "Fundada en",
      est_sub:
        "Hacienda El Cielo nació a nombre de la histórica Hacienda San Miguel.",
      foss_label: "Tierra de",
      foss_big: "Fósiles",
      foss_sub:
        "Vestigios de la Era Mesozoica — millones de años de historia en tierra virgen e inexplorada.",
    },
    location: {
      eyebrow: "Ubicación",
      title: "Cómo Llegar",
      desc: "Zaragoza, Coahuila se encuentra a solo dos horas de la frontera con Texas. Tres rutas convenientes desde Estados Unidos y México.",
      route1_title: "Desde Eagle Pass, Texas",
      route1_desc:
        "Cruce a Piedras Negras por el puente internacional y conduzca aproximadamente 2 horas hacia el sur por la carretera federal. Camino pavimentado en su totalidad.",
      route2_title: "Desde San Antonio, TX (Aeropuerto)",
      route2_desc:
        "Vuelo o traslado hasta Eagle Pass / Piedras Negras (aprox. 2h 30min en carro), después 2 horas a la hacienda. Total: aprox. 4.5 horas.",
      route3_title: "Desde Monterrey, N.L. (Aeropuerto)",
      route3_desc:
        "Vuele al aeropuerto de Piedras Negras (vuelo corto) y conduzca 2 horas hacia la hacienda. Opción ideal para huéspedes internacionales.",
    },
    reserve: {
      eyebrow: "Reservaciones",
      title: "Comience Su Aventura",
      desc: "Complete los siguientes datos y nuestro equipo se pondrá en contacto en menos de 24 horas para confirmar disponibilidad y detalles.",
      dates: "Su Visita",
      month_q: "¿Qué mes le gustaría visitarnos?",
      /*days_q: "¿Cuántos días? (3 a 4)",*/
      dates_followup:
        "Complete la información y le enviaremos un mensaje o correo en menos de 24 horas para coordinar las fechas disponibles.",
      months: [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Noviembre",
        "Diciembre",
      ],
      dates_info_title: "Información importante",
      dates_info: [
        "La cacería es de jueves a domingo: salimos al rancho el jueves y regresamos a Piedras Negras el domingo (3–4 días).",
        "La noche previa (miércoles) se hospeda en un hotel de Piedras Negras, por su cuenta; al día siguiente lo llevamos al rancho.",
        "Cada cazador puede elegir todos los paquetes de caza que desee (todos se suman al total de ese cazador).",
        "El hospedaje en la suite está incluido en el paquete de caza — sin costo extra.",
        "Para su seguridad y la nuestra, cada persona deberá adjuntar foto de su identificación oficial vigente (pasaporte o INE).",
        "Máximo 6 personas por sesión, en cualquier combinación de cazadores y acompañantes. Si desean venir 8 personas, con gusto revisamos fechas.",
      ],
      arrive: "Llegada",
      depart: "Salida",
      nights: "Número de Noches",
      hunters: "Cazadores",
      hunter_n: "Cazador",
      name: "Nombre Completo",
      age: "Edad",
      package: "Paquete",
      companions: "Acompañantes (no cazan)",
      companions_desc:
        "Acompañantes que no cazarán. Menores de 13 años: gratis. De 13 a 17 años: $150 USD por noche. 18 años o más: $350 USD por noche.",
      comp_n: "Acompañante",
      under10: "Menor de 13 años — Gratis",
      teen: "13–17 años — $150 USD/noche",
      adult: "18+ años — $350 USD/noche",
      suite_choice: "Suite Preferida",
      no_pref: "Sin preferencia",
      transport: "Cómo va a Llegar",
      transport_desc:
        "Indíquenos cómo planea llegar para coordinar su recepción. Si llega en avión, lo recogemos del aeropuerto, lo llevamos a su hotel en Piedras Negras y al día siguiente al rancho. Si llega en carro a Piedras Negras, lo trasladamos desde el hotel donde se hospede a la Hacienda — todo incluido.",
      transport_opts: [
        {
          value: "carro",
          label:
            "En carro propio (traslado desde su hotel en Piedras Negras incluido)",
        },
        {
          value: "drt",
          label: "Aeropuerto de Del Rio (DRT)",
        },
        {
          value: "egp",
          label: "Aeropuerto de Eagle Pass (EGP)",
        },
        {
          value: "pds",
          label: "Aeropuerto de Piedras Negras (PDS)",
        },
      ],
      hotel_pn: "Hotel en Piedras Negras",
      hotel_pn_desc:
        "Hotel en Piedras Negras donde se hospedará la noche previa (miércoles). Al día siguiente, jueves, lo recogemos de ahí y lo llevamos al rancho.",
      hotel_pn_opts: [
        {
          value: "hampton",
          label: "Hampton by Hilton Piedras Negras",
        },
        {
          value: "hyatt",
          label: "Hyatt Place Piedras Negras",
        },
      ],
      notes: "Notas / Solicitudes Especiales",
      notes_ph:
        "Alergias, restricciones alimentarias, necesidades especiales...",
      add_hunter: "+ Agregar cazador",
      add_comp: "+ Agregar acompañante",
      max_reached: "Máximo de 6 personas alcanzado",
      remove: "Quitar",
      id_upload: "Identificación (PNG, JPG o PDF)",
      id_upload_note: "La foto se debe ver con claridad",
      id_change: "Cambiar",
      id_upload_btn: "Subir",
      id_uploaded: "Archivo cargado",
      suite_label: "Suite (incluida en el paquete)",
      suite_per_hunter_note:
        "Cada cazador puede agregar todos los paquetes de caza que desee — todos se suman a su total. El hospedaje en suite está incluido en cada paquete, sin costo adicional.",
      add_pkg: "+ Agregar paquete",
      remove_pkg: "Quitar paquete",
      total: "Estimado",
      submit_wa: "Enviar por WhatsApp",
      submit_email: "Enviar por Email",
      submit_sms: "Enviar por SMS / iMessage",
      deposit_label: "Anticipo para reservar",
      pay_btn: "Pagar anticipo",
      pay_soon:
        "Para apartar su lugar, coordine su anticipo por WhatsApp o transferencia bancaria. ¡Con gusto le ayudamos!",
      policy_title: "Reservación y cancelaciones",
      policy_deposit:
        "Para reservar su lugar se requiere un anticipo del 30% del total (se calcula y muestra abajo al seleccionar su paquete).",
      policy_50: "Ese anticipo del 30% no es reembolsable.",
      policy_cancel:
        "Cancelaciones: debe cancelar al menos 3 meses antes de su fecha. Dentro de los 3 meses previos a su llegada se cubre el 70% restante del total (el 30% se paga como anticipo al reservar).",
      tips_label: "Sobre las propinas",
      tips_note:
        "Las propinas no son obligatorias. Quedan completamente a su criterio según el servicio que reciba durante su estancia en Hacienda El Cielo. Apreciamos cualquier gesto que decida tener con nuestro equipo — guías, cocina y personal de hospedaje.",
      select: "— Seleccionar —",
    },
    contact: {
      eyebrow: "Contacto",
      title: "Estamos Para Servirle",
      phone: "Teléfono / WhatsApp",
      email: "Correo Electrónico",
      ig: "Instagram",
      fb: "Facebook",
      address: "Zaragoza, Coahuila, México",
    },
    tienda: {
      eyebrow: "Tienda",
      title: "Nuestra Tienda",
      desc: "Llévese un pedazo de Hacienda El Cielo a casa. Vinos de la casa, accesorios para el cazador y artículos personalizables. Precios de referencia.",
      colors_label: "Colores",
      sizes_label: "Tallas",
      custom_badge: "Personalizable +$15",
      custom_note: "La personalización tiene un costo adicional de $15 USD.",
      note: "Los precios mostrados son de referencia y pueden variar. Para comprar o personalizar, contáctenos por WhatsApp.",
      drag_hint: "Deslice para ver más →",
      products: [
        {
          tag: "Vino",
          name: "Vino Joven",
          desc: "Tinto joven de la casa — fresco, afrutado y fácil de beber.",
          price: "$35 USD",
        },
        {
          tag: "Vino",
          name: "Vino Reserva",
          desc: "Crianza en barrica de roble. Equilibrado, elegante, con carácter.",
          price: "$55 USD",
        },
        {
          tag: "Vino",
          name: "Vino Gran Reserva",
          desc: "Nuestra etiqueta más distinguida. Cuerpo intenso y final largo.",
          price: "$85 USD",
        },
        {
          tag: "Accesorio",
          name: "Cenicero",
          desc: "Cenicero de la hacienda, edición de cacería. Pieza de colección.",
          price: "$40 USD",
        },
        {
          tag: "Accesorio",
          name: "Porta Puros",
          desc: "Estuche de piel para 3 puros, con grabado El Cielo.",
          price: "$60 USD",
        },
        {
          tag: "Accesorio",
          name: "Humidor",
          desc: "Humidor de cedro para 20 puros. Conserva la humedad perfecta.",
          price: "$180 USD",
        },
        {
          tag: "Petaca",
          name: "Whiskey Flask · Clásica",
          desc: "Petaca de acero inoxidable de 8 oz, grabada con el logo.",
          price: "$45 USD",
        },
        {
          tag: "Petaca",
          name: "Whiskey Flask · Cuero",
          desc: "Petaca forrada en piel auténtica con grabado El Cielo.",
          price: "$55 USD",
        },
        {
          tag: "Textil",
          name: "Gorra / Cachucha",
          desc: "Gorra bordada con el logo de la hacienda. Ajustable.",
          price: "$30 USD",
        },
        {
          tag: "Termo",
          name: "Yeti 20 oz",
          desc: "Termo de 20 oz que mantiene la temperatura por horas.",
          price: "$45 USD",
          colors: ["Negro", "Verde militar"],
          custom: true,
        },
        {
          tag: "Termo",
          name: "Yeti 6 oz",
          desc: "Termo compacto de 6 oz, perfecto para el campo.",
          price: "$30 USD",
          colors: ["Negro", "Verde militar"],
          custom: true,
        },
        {
          tag: "Textil",
          name: "Chaleco",
          desc: "Chaleco acolchado bordado con el logo de la hacienda.",
          price: "$90 USD",
          sizes: ["S", "M", "L", "XL"],
        },
      ],
    },
    footer: {
      tagline:
        "Cacería de lujo en la frontera más segura entre México y Texas.",
      rights: "Todos los derechos reservados.",
    },
  },
  en: {
    nav: {
      home: "Home",
      nature: "Hunting",
      hunt: "Hunting",
      hacienda: "Hacienda",
      hacienda_main: "The Hacienda",
      clubhouse: "Clubhouse",
      suites: "Suites",
      dining: "Bar",
      kitchen: "Kitchen",
      exterior: "Exterior",
      activities: "Activities",
      about: "History",
      location: "Location",
      contact: "Contact",
      store: "Store",
      reserve: "Reserve",
      menu: "Menu",
      explore: "Explore",
    },
    hero: {
      eyebrow: "Zaragoza · Coahuila · Mexico",
      title1: "HACIENDA",
      title2: "EL CIELO",
      tagline:
        "A luxury hunting experience among majestic Mexican mountains, lush wilderness and legendary trophies — on the safest border between Texas and Mexico.",
      cta1: "Book Your Stay",
      cta2: "Explore Packages",
    },
    safety: {
      title: "The Safest Border",
      sub: "Zaragoza, Coahuila",
      stat1: "7",
      stat1_label: "Consecutive years as the safest border",
      stat2: "100 km",
      stat2_label: "From the Rio Grande · Sierra del Burro, Northern Coahuila",
      stat3: "Sierra",
      stat3_label: "Where the Sierra del Burro begins · Untouched nature",
      desc1:
        "We are 100 km from the Rio Grande, in the heart of Northern Coahuila — the best region in Mexico for whitetail deer. Piedras Negras has been the safest border between Mexico and the United States for 7 consecutive years.",
      desc2:
        "Our location is strategic: where the majestic Sierra del Burro begins. A completely untouched region filled with forests, sierras, century-old trees and pure nature — the perfect setting for an unforgettable hunt.",
      how_title: "How to Arrive",
      how_desc:
        "Two ways to arrive — by plane to one of three nearby airports (Piedras Negras, Eagle Pass or Del Rio), or by road. If you arrive by plane, our team picks you up directly at the airport and takes you to the hotel you select in Piedras Negras (Hyatt Place or Hampton by Hilton), and on to the ranch the next day. All transfer is included.",
      by_car: "BY CAR FROM TEXAS TO PIEDRAS NEGRAS AND YOUR HOTEL",
      dest_label: "Hotel destination",
      by_air: "BY AIR",
      car_transfer_note:
        "From your hotel in Piedras Negras we transfer you to the Hacienda in an SUV — all included, no extra cost. If you prefer to drive your own vehicle to the ranch, we recommend a pickup truck, jeep or any 4x4, and simply follow our guide to the Hacienda.",
      transfer_label: "By SUV",
      transfer_note:
        "If you arrive by plane at Piedras Negras, Eagle Pass or Del Rio, our team picks you up directly at the airport and takes you to the hotel you select (Hyatt Place or Hampton by Hilton, in Piedras Negras). The next day we take you to the ranch. All included.",
      car_routes: [
        {
          city: "Eagle Pass, TX",
          time: "10 min",
          desc: "Cross the international bridge into Piedras Negras and head to your hotel.",
          mapUrls: {
            hampton:
              "https://www.google.com/maps/dir/?api=1&origin=Eagle+Pass,+TX&destination=Hampton+by+Hilton+Piedras+Negras",
            hyatt:
              "https://www.google.com/maps/dir/?api=1&origin=Eagle+Pass,+TX&destination=Hyatt+Place+Piedras+Negras",
          },
        },
        {
          city: "San Antonio, TX",
          time: "2.5 hrs",
          desc: "Drive to Eagle Pass and cross into Piedras Negras to your hotel.",
          mapUrls: {
            hampton:
              "https://www.google.com/maps/dir/?api=1&origin=San+Antonio,+TX&destination=Hampton+by+Hilton+Piedras+Negras",
            hyatt:
              "https://www.google.com/maps/dir/?api=1&origin=San+Antonio,+TX&destination=Hyatt+Place+Piedras+Negras",
          },
        },
        {
          city: "Austin, TX",
          time: "4 hrs",
          desc: "Drive southwest to Eagle Pass, cross into Piedras Negras and head to your hotel.",
          mapUrls: {
            hampton:
              "https://www.google.com/maps/dir/?api=1&origin=Austin,+TX&destination=Hampton+by+Hilton+Piedras+Negras",
            hyatt:
              "https://www.google.com/maps/dir/?api=1&origin=Austin,+TX&destination=Hyatt+Place+Piedras+Negras",
          },
        },
        {
          city: "Houston, TX",
          time: "5 hrs",
          desc: "Take I-10 W toward San Antonio, then south to Eagle Pass and Piedras Negras.",
          mapUrls: {
            hampton:
              "https://www.google.com/maps/dir/?api=1&origin=Houston,+TX&destination=Hampton+by+Hilton+Piedras+Negras",
            hyatt:
              "https://www.google.com/maps/dir/?api=1&origin=Houston,+TX&destination=Hyatt+Place+Piedras+Negras",
          },
        },
        {
          city: "Dallas, TX",
          time: "6 hrs",
          desc: "Take I-35 S via San Antonio to Eagle Pass and Piedras Negras.",
          mapUrls: {
            hampton:
              "https://www.google.com/maps/dir/?api=1&origin=Dallas,+TX&destination=Hampton+by+Hilton+Piedras+Negras",
            hyatt:
              "https://www.google.com/maps/dir/?api=1&origin=Dallas,+TX&destination=Hyatt+Place+Piedras+Negras",
          },
        },
        {
          city: "Monterrey, N.L.",
          time: "4-5 hrs",
          desc: "Federal highway to Piedras Negras and on to your hotel.",
          mapUrls: {
            hampton:
              "https://www.google.com/maps/dir/?api=1&origin=Monterrey,+Nuevo+Leon&destination=Hampton+by+Hilton+Piedras+Negras",
            hyatt:
              "https://www.google.com/maps/dir/?api=1&origin=Monterrey,+Nuevo+Leon&destination=Hyatt+Place+Piedras+Negras",
          },
        },
      ],
      airports: [
        {
          name: "Del Rio Airport (DRT)",
          desc: "Regional Texas airport — transfer included to your hotel in Piedras Negras and then to the ranch.",
          mapUrl: "https://www.google.com/maps?q=29.3742,-100.9277&z=15",
        },
        {
          name: "Eagle Pass Airport (EGP)",
          desc: "Closest on the American side. Transfer to hotel and hacienda included.",
          mapUrl: "https://www.google.com/maps?q=28.8627,-100.5152&z=15",
        },
        {
          name: "Piedras Negras Airport (PDS)",
          desc: "Flights from Monterrey and Mexico City. Transfer to hotel and ranch included.",
          mapUrl: "https://www.google.com/maps?q=28.6273,-100.5350&z=15",
        },
      ],
      hotel_title: "Lodging Recommendations · Piedras Negras",
      hotel_desc:
        "We recommend spending the night before in Piedras Negras before coming to the ranch. Two excellent options:",
      hotels: [
        {
          name: "Hampton by Hilton Piedras Negras",
          url: "https://www.hilton.com/en/locations/mexico/piedras-negras/hampton-by-hilton/?WT.mc_id=zlada0ww1hx2psh3ggl4advbpp5dkt6multibr7_153665317_1003528&gclsrc=aw.ds&gad_source=1&gad_campaignid=687014284&gbraid=0AAAAADQ3sJ16867bShqXxCYG_Wze4KpQM&gclid=CjwKCAjwidXQBhAZEiwA4egw6E6Oy_5A946w3sbxgcNOsvR_namhBrXoBNuzEOUcPLTrlPalHwTEwxoC9u4QAvD_BwE#",
        },
        {
          name: "Hyatt Place Piedras Negras",
          url: "https://www.hyatt.com/hyatt-place/es-ES/pdszp-hyatt-place-piedras-negras",
        },
      ],
      open_directions: "Open directions in Google Maps",
      open_in_maps: "Open in Google Maps",
      view_on_map: "View on map",
      view_in_maps: "View on Google Maps",
      recommended: "Recommended",
      pin_hacienda_sub: "Zaragoza, Coahuila",
      pin_pds_sub: "City + Airport (PDS)",
      pin_egp_sub: "City + Airport (EGP)",
      pin_drt_sub: "Airport (DRT)",
    },
    nature: {
      eyebrow: "Hunting",
      title: "Nature & Hunting",
      desc: "Towering Mexican sierras, century-old encino oaks, blooming mesquites and crystal-clear streams compose a living landscape where wildlife thrives. Every sunrise reveals a new chapter of pure nature.",
      card1: "Majestic Sierras",
      card1_d:
        "Mountain ranges that stretch to the horizon, offering breathtaking vistas.",
      card2: "Ancient Forests",
      card2_d: "Enormous trees that have witnessed generations of hunters.",
      card3: "Lush Vegetation",
      card3_d:
        "A thriving ecosystem that sustains exceptional wildlife year-round.",
    },
    hunt: {
      eyebrow: "Hunting",
      title: "Trophies of Legend",
      sub_trofeos: "Trophies",
      garantia_title: "Opportunity Guarantee",
      garantia_desc:
        "If after the shot the animal is wounded and escapes, but there is clear evidence of impact — blood, hair or bone — it counts as a harvested animal. A shot that does not connect does not count as a take.",
      desc: "Three packages designed for every level of pursuit, plus an exclusive experience for photographers. Each stay includes a specialized guide, internal transport and the guarantee of extraordinary opportunities.",
      photo_eyebrow: "Photography Only",
      photo_title: "The Silent Hunter",
      photo_desc:
        "For nature lovers who prefer to capture the moment with a lens. Full access to wildlife viewing areas, guide and lodging included. No hunting. Available year-round.",
      photo_includes: ["All inclusive (3 meals + alcohol)", "Lodging", "Guide"],
      photo_price: "$2,500 USD",
      packages_title: "Hunting Packages",
      booking_cta: "Request Reservation",
      seasons: "Seasons",
      season_deer: "Deer · November – February",
      season_turkey: "Turkey · March – May",
    },
    packages: [
      {
        name: "The Golden Throne",
        sub: "Deer · High Fence",
        price: "$15,500",
        unit: "USD",
        desc: "Our most exclusive experience. Priority access to our largest-caliber deer in our 500-hectare high-fence Reserve — where legendary trophies are forged.",
        includes: [
          "All inclusive (3 meals + alcohol)",
          "Lodging",
          "Guide",
          "1 animal",
        ],
        deposit: 7500,
      },
      {
        name: "Whisper of the Wild",
        sub: "Deer · Low Fence",
        price: "$8,500",
        unit: "USD",
        desc: "For the hunter seeking an honest trophy. Access to whitetail in low-fence territory, where cunning and patience matter as much as aim.",
        includes: [
          "All inclusive (3 meals + alcohol)",
          "Lodging",
          "Guide",
          "1 animal",
        ],
        deposit: 7500,
      },
      {
        name: "Song of Dawn",
        sub: "Turkey Hunt",
        price: "$3,500",
        unit: "USD",
        desc: "A focused experience for wild turkey — one of the most exciting challenges in Mexican hunting. Ideal for memorable weekends.",
        includes: [
          "All inclusive (3 meals + alcohol)",
          "Lodging",
          "Guide",
          "1 animal",
        ],
        deposit: 1500,
      },
    ],
    hacienda_section: {
      eyebrow: "The Hacienda",
      title: "A Hunter's Refuge",
      desc: "A property designed for the discerning hunter: traditional Mexican architecture, modern comforts, spaces to share the day's stories.",
      subsections_label: "sections to discover",
      tabs: {
        main: "The Hacienda",
        club: "Clubhouse",
        suites: "Suites",
        food: "Bar",
        cocina: "Kitchen",
        actividades: "Activities",
      },
      main_desc:
        "The heart of Hacienda El Cielo. A building that honors Coahuila tradition with details in stone, wood and hand-forged iron. Every corner tells a story.",
      club_desc:
        "The Clubhouse bar is where the best anecdotes are born. Whiskey by the fire, maps spread across the table, plans for the next sunrise.",
      suites_desc:
        "Six unique suites — Caymus, Opus, Seven, Storm, Petrus and Kratos — each named after a legendary buck. Designed for deep rest after a long day in the field.",
      suites_features: [
        "2 beds (capacity for 4)",
        "Private bath with shower",
        "Television",
        "WiFi",
        "Lodging included in hunting packages",
      ],
      food_desc:
        "The Hacienda El Cielo bar: house wines, aged whiskey and select mezcals. The perfect place to toast the day and share the stories of the hunt.",
      cocina_desc:
        "Elevated traditional Mexican cuisine. Local produce, family recipes, ingredients that only grow on these lands. Three daily meals included in every package.",
      ext_desc:
        "Stone-paved patios, open-air firepits, viewpoints overlooking the sierra. The exterior of the hacienda invites you to live every hour of the day.",
      activities_eyebrow: "Activities",
      activities_title: "Beyond the Hunt",
      act_desc:
        "Beyond the hunt, Hacienda El Cielo offers experiences that extend the adventure. For hunters, companions and entire families.",
      activities: [
        {
          name: "Hiking",
          desc: "Guided trips into the hills and the Sierra del Burro, where untouched nature reveals its secrets.",
        },
        {
          name: "Shotgun Clay Shooting",
          desc: "Practice your aim with discs launched into the air. Fun and training at the same time.",
        },
        {
          name: "Fishing",
          desc: "Quiet days at rivers and streams — perfect for companions and children.",
        },
        {
          name: "Outdoor Games",
          desc: "Classic outdoor American games. Friendly competition by the fire, drinks in hand.",
        },
        {
          name: "Campfires & Starry Skies",
          desc: "Nights at Hacienda El Cielo are unforgettable. Clear skies, crackling fires, hunter stories.",
        },
        {
          name: "Wildlife Viewing",
          desc: "For those who prefer to observe — deer, turkeys, black bears, blue birds and endemic species in their natural habitat.",
        },
      ],
    },
    suites: [
      {
        name: "Caymus",
        desc: "Named after Caymus — one of our most imposing breeding bucks, father to generations of magnificent deer in these sierras. A suite for those who aspire to greatness.",
      },
      {
        name: "Kratos",
        desc: "Named for the most colossal breeding buck ever to walk this ranch. Titanic antlers, legendary presence. Stay where giants sleep.",
      },
      {
        name: "Seven",
        desc: "The owner's favorite buck — seven perfect points, the lucky number. Every hunter who stays here feels that same fortune at sunrise.",
      },
      {
        name: "Storm",
        desc: "The very first breeding buck to arrive at Hacienda El Cielo — and with him, a spectacular storm baptized the land that same day. History sleeps here: where it all began, where thunder marked our name.",
      },
      {
        name: "Petrus",
        desc: "Inspired by Pétrus, the most coveted wine in the world. We gave the name to the finest breeding buck on the ranch — because some bloodlines deserve only the rarest, most desired names. For the hunter who understands what is truly irreplaceable.",
      },
      {
        name: "Opus",
        desc: "Like Opus One — one of the most prestigious wines in the United States. A breeding buck of undeniable elegance and exceptional genetics. This suite honors hunting as a masterpiece: precision, patience, perfection.",
      },
    ],
    about: {
      eyebrow: "History",
      title: "A Family Tradition",
      p1: "Hacienda El Cielo is born from a Coahuila family's passion for ethical hunting, respect for nature and Mexican hospitality. We have spent decades caring for these lands and the wildlife that inhabits them.",
      p2: "We believe in responsible hunting: healthy populations, professional management, expert guides who know every corner of the property. Every guest becomes part of the family.",
      p3: "We invite you to discover a different Mexico: safe, welcoming, generous. The Mexico of the sierras, of golden sunrises, of stories around the fire.",
      legacy:
        "Here the wilderness remains completely untouched: over 200 years without exploration or human settlement. Hacienda El Cielo was founded in 1930 under the name of the historic Hacienda San Miguel — wild land where deer have grown free and trophies have been forged in silence, generation after generation.",
      est_label: "Founded in",
      est_sub:
        "Hacienda El Cielo was born under the name of the historic Hacienda San Miguel.",
      foss_label: "Land of",
      foss_big: "Fossils",
      foss_sub:
        "Relics of the Mesozoic Era — millions of years of history in untouched, unexplored land.",
    },
    location: {
      eyebrow: "Location",
      title: "How to Arrive",
      desc: "Zaragoza, Coahuila is just two hours from the Texas border. Three convenient routes from the United States and Mexico.",
      route1_title: "From Eagle Pass, Texas",
      route1_desc:
        "Cross to Piedras Negras via the international bridge and drive approximately 2 hours south on federal highway. Fully paved road.",
      route2_title: "From San Antonio, TX (Airport)",
      route2_desc:
        "Fly or drive to Eagle Pass / Piedras Negras (approx. 2h 30min by car), then 2 hours to the hacienda. Total: approx. 4.5 hours.",
      route3_title: "From Monterrey, N.L. (Airport)",
      route3_desc:
        "Fly into Piedras Negras airport (short flight) and drive 2 hours to the hacienda. Ideal option for international guests.",
    },
    reserve: {
      eyebrow: "Reservations",
      title: "Begin Your Adventure",
      desc: "Complete the form below and our team will reach out within 24 hours to confirm availability and details.",
      dates: "Your Visit",
      month_q: "Which month would you like to visit?",
      /*days_q: "How many days? (3 to 4)",*/
      dates_followup:
        "Complete the form and we will message or email you within 24 hours to coordinate available dates.",
      months: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "November",
        "December",
      ],
      dates_info_title: "Important information",
      dates_info: [
        "The night before (Wednesday) you stay at a hotel in Piedras Negras, on your own; the next day we take you to the ranch.",
        "The hunt runs Thursday to Sunday: we head to the ranch on Thursday and return to Piedras Negras on Sunday (3–4 days).",
        "Maximum 6 people per session, in any combination of hunters and companions. If you would like to come as 8, we are glad to review dates — just contact us.",
        "Suite lodging is included in the hunting package — no extra charge.",
        "Each hunter can choose as many hunting packages as they wish (all are added to that hunter's total).",
        "For your safety and ours, every person must attach a photo of valid official ID (passport or driver's license).",
      ],
      arrive: "Arrival",
      depart: "Departure",
      nights: "Number of Nights",
      hunters: "Hunters",
      hunter_n: "Hunter",
      name: "Full Name",
      age: "Age",
      package: "Package",
      companions: "Companions (non-hunters)",
      companions_desc:
        "Companions who will not hunt. Under 13 years: free. 13 to 17 years: $150 USD per night. 18 or older: $350 USD per night.",
      comp_n: "Companion",
      under10: "Under 13 — Free",
      teen: "13–17 years — $150 USD/night",
      adult: "18+ years — $350 USD/night",
      suite_choice: "Preferred Suite",
      no_pref: "No preference",
      transport: "How You Will Arrive",
      transport_desc:
        "Let us know how you plan to arrive so we can coordinate your reception. If arriving by plane, we pick you up at the airport, take you to your hotel in Piedras Negras and on to the ranch the next day. If arriving by car to Piedras Negras, we transfer you from your hotel to the Hacienda — all included.",
      transport_opts: [
        {
          value: "carro",
          label: "Own car (transfer from your Piedras Negras hotel included)",
        },
        {
          value: "drt",
          label: "Del Rio Airport (DRT)",
        },
        {
          value: "egp",
          label: "Eagle Pass Airport (EGP)",
        },
        {
          value: "pds",
          label: "Piedras Negras Airport (PDS)",
        },
      ],
      hotel_pn: "Hotel in Piedras Negras",
      hotel_pn_desc:
        "Hotel in Piedras Negras where you'll stay the night before (Wednesday). The next day, Thursday, we'll pick you up from there and take you to the ranch.",
      hotel_pn_opts: [
        {
          value: "hampton",
          label: "Hampton by Hilton Piedras Negras",
        },
        {
          value: "hyatt",
          label: "Hyatt Place Piedras Negras",
        },
      ],
      notes: "Notes / Special Requests",
      notes_ph: "Allergies, dietary restrictions, special needs...",
      add_hunter: "+ Add hunter",
      add_comp: "+ Add companion",
      max_reached: "Maximum of 6 people reached",
      remove: "Remove",
      id_upload: "ID (PNG, JPG or PDF)",
      id_upload_note:
        "Upload a photo of each person's passport or driver's license.",
      id_change: "Change",
      id_upload_btn: "Upload",
      id_uploaded: "File uploaded",
      suite_label: "Suite (included in package)",
      suite_per_hunter_note:
        "Each hunter can add as many hunting packages as they wish — all are added to their total. Suite lodging is included in every package at no extra cost.",
      add_pkg: "+ Add package",
      remove_pkg: "Remove package",
      total: "Estimate",
      submit_wa: "Send via WhatsApp",
      submit_email: "Send via Email",
      submit_sms: "Send via SMS / iMessage",
      deposit_label: "Deposit to reserve",
      pay_btn: "Pay deposit",
      pay_soon:
        "To reserve your spot, please arrange your deposit via WhatsApp or bank transfer. We will gladly help!",
      policy_title: "Reservation & cancellations",
      policy_deposit:
        "To reserve your spot, a 30% deposit of the total is required (calculated and shown below once you select your package).",
      policy_50: "That 30% deposit is non-refundable.",
      policy_cancel:
        "Cancellations: you must cancel at least 3 months before your date. Within the 3 months prior to your arrival, the remaining 70% of the total is due (the 30% deposit is paid at booking).",
      tips_label: "About gratuities",
      tips_note:
        "Tips are not mandatory. They are entirely at your discretion based on the service you receive during your stay at Hacienda El Cielo. We appreciate any gesture you choose to extend to our team — guides, kitchen and lodging staff.",
      select: "— Select —",
    },
    contact: {
      eyebrow: "Contact",
      title: "We Are Here For You",
      phone: "Phone / WhatsApp",
      email: "Email",
      ig: "Instagram",
      fb: "Facebook",
      address: "Zaragoza, Coahuila, Mexico",
    },
    tienda: {
      eyebrow: "Store",
      title: "Our Store",
      desc: "Take a piece of Hacienda El Cielo home. House wines, hunter's accessories and customizable items. Reference prices.",
      colors_label: "Colors",
      sizes_label: "Sizes",
      custom_badge: "Customizable +$15",
      custom_note: "Customization carries an additional $15 USD cost.",
      note: "Prices shown are for reference and may vary. To purchase or customize, contact us on WhatsApp.",
      drag_hint: "Swipe to see more →",
      products: [
        {
          tag: "Wine",
          name: "Young Wine",
          desc: "House young red — fresh, fruity and easy to drink.",
          price: "$35 USD",
        },
        {
          tag: "Wine",
          name: "Reserva Wine",
          desc: "Aged in oak barrels. Balanced, elegant and full of character.",
          price: "$55 USD",
        },
        {
          tag: "Wine",
          name: "Gran Reserva Wine",
          desc: "Our most distinguished label. Intense body, long finish.",
          price: "$85 USD",
        },
        {
          tag: "Accessory",
          name: "Ashtray",
          desc: "Hacienda ashtray, hunting edition. A collector's piece.",
          price: "$40 USD",
        },
        {
          tag: "Accessory",
          name: "Cigar Holder",
          desc: "Leather case for 3 cigars, engraved with El Cielo.",
          price: "$60 USD",
        },
        {
          tag: "Accessory",
          name: "Humidor",
          desc: "Cedar humidor for 20 cigars. Keeps perfect humidity.",
          price: "$180 USD",
        },
        {
          tag: "Flask",
          name: "Whiskey Flask · Classic",
          desc: "8 oz stainless steel flask, engraved with the logo.",
          price: "$45 USD",
        },
        {
          tag: "Flask",
          name: "Whiskey Flask · Leather",
          desc: "Flask wrapped in genuine leather with El Cielo engraving.",
          price: "$55 USD",
        },
        {
          tag: "Apparel",
          name: "Cap",
          desc: "Cap embroidered with the hacienda logo. Adjustable.",
          price: "$30 USD",
        },
        {
          tag: "Tumbler",
          name: "Yeti 20 oz",
          desc: "20 oz tumbler that holds temperature for hours.",
          price: "$45 USD",
          colors: ["Black", "Military green"],
          custom: true,
        },
        {
          tag: "Tumbler",
          name: "Yeti 6 oz",
          desc: "Compact 6 oz tumbler, perfect for the field.",
          price: "$30 USD",
          colors: ["Black", "Military green"],
          custom: true,
        },
        {
          tag: "Apparel",
          name: "Vest",
          desc: "Quilted vest embroidered with the hacienda logo.",
          price: "$90 USD",
          sizes: ["S", "M", "L", "XL"],
        },
      ],
    },
    footer: {
      tagline: "Luxury hunting on the safest border between Mexico and Texas.",
      rights: "All rights reserved.",
    },
  },
};

const HISTORIA = {
  history: "images/historia/67.webp",
};

const ACTIVITIES = {
  hiking: "images/HaciendaSection/activities/70.webp",
  starry_skies: "images/HaciendaSection/activities/25.webp",
  wildlife: "images/HaciendaSection/activities/33.webp",
};

const PACKAGES_IMAGES = {
  guajolote: "images/paquetes/20.webp",
  cercaAlta: "images/paquetes/IMG_1047.webp",
  cercaBaja: "images/paquetes/41.webp",
  cazador: "images/paquetes/1C.webp",
};

const DEER_IMAGES = {
  petrus: "images/venados/petrus.webp",
  kratos: "images/venados/kratos.webp",
  caymus: "images/venados/caymus.webp",
  storm: "images/venados/storm.webp",
  seven: "images/venados/seven.webp",
  bernie: "images/venados/bernie.webp",
};

const NATURE_IMAGES = [
  "images/Nature-Hunting-opt/1.webp",
  "images/Nature-Hunting-opt/1B.webp",
  "images/Nature-Hunting-opt/2.webp",
  "images/Nature-Hunting-opt/2C.webp",
  "images/Nature-Hunting-opt/2E.webp",
  "images/Nature-Hunting-opt/3a.webp",
  "images/Nature-Hunting-opt/7B.webp",
  "images/Nature-Hunting-opt/8B.webp",
  "images/Nature-Hunting-opt/8ok.webp",
  "images/Nature-Hunting-opt/9B.webp",
  "images/Nature-Hunting-opt/10.webp",
  "images/Nature-Hunting-opt/11.webp",
  "images/Nature-Hunting-opt/15.webp",
  "images/Nature-Hunting-opt/15B.webp",
  "images/Nature-Hunting-opt/18.webp",
  "images/Nature-Hunting-opt/19.webp",
  "images/Nature-Hunting-opt/21.webp",
  "images/Nature-Hunting-opt/21C.webp",
  "images/Nature-Hunting-opt/22.webp",
  "images/Nature-Hunting-opt/23B.webp",
  "images/Nature-Hunting-opt/24.webp",
  "images/Nature-Hunting-opt/25.webp",
  "images/Nature-Hunting-opt/26.webp",
  "images/Nature-Hunting-opt/26B.webp",
  "images/Nature-Hunting-opt/28B.webp",
  "images/Nature-Hunting-opt/29B.webp",
  "images/Nature-Hunting-opt/30.webp",
  "images/Nature-Hunting-opt/32.webp",
  "images/Nature-Hunting-opt/38.webp",
  "images/Nature-Hunting-opt/45.webp",
  "images/Nature-Hunting-opt/47.webp",
  "images/Nature-Hunting-opt/52.webp",
  "images/Nature-Hunting-opt/61.webp",
  "images/Nature-Hunting-opt/67B.webp",
  "images/Nature-Hunting-opt/68.webp",
  "images/Nature-Hunting-opt/71.webp",
  "images/Nature-Hunting-opt/71B.webp",
  "images/Nature-Hunting-opt/90.webp",
  "images/Nature-Hunting-opt/99.webp",
];

const VIDEOS = {
  hacienda_ext_video: "https://www.pexels.com/download/video/37917262/",
  deer1: "https://www.pexels.com/download/video/14009472/",
  deer2: "https://www.pexels.com/download/video/36597741/",
  deer3: "https://www.pexels.com/download/video/3195531/",
  deer4: "https://www.pexels.com/download/video/28589076/",
  clubhouse: "https://www.pexels.com/download/video/10374972/",
  bar: "https://www.pexels.com/download/video/13063147/",
  suite1: "https://www.pexels.com/download/video/29466040/",
  kitchen: "https://www.pexels.com/download/video/8902154/",
  hiking: "https://www.pexels.com/download/video/28267635/",
  shooting: "https://www.pexels.com/download/video/6655863/",
  fishing: "https://www.pexels.com/download/video/5249055/",
  outdoorGames: "https://www.pexels.com/download/video/37483445/",
  campfires: "https://www.pexels.com/download/video/6951412/",
  wildlife: "https://www.pexels.com/download/video/7612155/",
};

// Stock photo URLs (Unsplash)
const PHOTOS = {
  deer1:
    "https://images.unsplash.com/photo-1484406566174-9da000fda645?auto=format&fit=crop&w=1200&q=80",
  deer2:
    "https://images.unsplash.com/photo-1551269901-5c5e14c25df7?auto=format&fit=crop&w=1200&q=80",
  deer3:
    "https://images.unsplash.com/photo-1484406566174-9da000fda645?auto=format&fit=crop&w=1200&q=80",
  turkey:
    "https://images.unsplash.com/photo-1606851094291-6efae152bb87?auto=format&fit=crop&w=1200&q=80",
  birds:
    "https://images.unsplash.com/photo-1551085254-e96b210db58a?auto=format&fit=crop&w=1200&q=80",
  mountains:
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
  forest:
    "https://images.unsplash.com/photo-1473773508845-188df298d2d1?auto=format&fit=crop&w=1200&q=80",
  trees:
    "https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=1200&q=80",
  vegetation:
    "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80",
  // Hacienda exteriors
  hacienda_ext: "images/HaciendaSection/hacienda/Hacienda(Exterior).webp",
  hacienda_ext2: "images/HaciendaSection/hacienda/ParrillaExterior.webp",
  hacienda_ext3: "images/HaciendaSection/hacienda/Firepit.webp",
  hacienda_ext4:
    "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80",
  // Suites / rooms
  suite: "images/HaciendaSection/suites/Suite1cama.webp",
  suite2: "images/HaciendaSection/suites/Suite 2_Naranja_Quemado_Hacienda.webp",
  suite3: "images/HaciendaSection/suites/Suite 3_Crema_Hacienda.webp",
  suite4:
    "images/HaciendaSection/suites/Suite 4_Mostaza_Quemado_Hacienda_v2.webp",
  suite5: "images/HaciendaSection/suites/Baño Suite.webp",
  banosuite: "images/HaciendaSection/suites/suite1cama.webp",
  // Bar / clubhouse
  Bar: "images/HaciendaSection/bar/Bar.webp",
  botellasVino: "images/HaciendaSection/bar/Botellas de Vinos HEC.webp",
  mesaPool: "images/HaciendaSection/bar/Mesa pool.webp",
  mezcal: "images/HaciendaSection/bar/Mezcal.webp",
  whiskey: "images/HaciendaSection/bar/Whiskey.webp",
  bar2: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&w=1200&q=80",
  bar3: "https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=1200&q=80",
  //kitchen
  kitchen: "images/HaciendaSection/clubhouse/Cocina.webp",
  diningRoom: "images/HaciendaSection/clubhouse/Comedor.webp",
  livingRoom: "images/HaciendaSection/clubhouse/Sala.webp",
  barCH: "images/HaciendaSection/clubhouse/Bar.webp",
  // Food
  food: "images/HaciendaSection/kitchen/tacos.webp",
  food2: "images/HaciendaSection/kitchen/tacos2.webp",
  food3: "images/HaciendaSection/kitchen/nachos.webp",
  food4: "images/HaciendaSection/kitchen/molcajete.webp",
  food5: "images/HaciendaSection/kitchen/burrito.webp",
  food6: "images/HaciendaSection/kitchen/comidamx.webp",
  // Exterior life
  fire: "https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?auto=format&fit=crop&w=1200&q=80",
  patio:
    "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=1200&q=80",
  stars:
    "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?auto=format&fit=crop&w=1200&q=80",
  // Activities
  hiking:
    "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=1200&q=80",
  shooting: "images/HaciendaSection/activities/Tiro Al Plato.webp",
  fishing:
    "https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&w=1200&q=80",
  cornhole: "images/HaciendaSection/activities/Juegos al aire libre.webp",
  campfire:
    "https://images.unsplash.com/photo-1475070929565-c985b496cb9f?auto=format&fit=crop&w=1200&q=80",
  wildlife:
    "https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?auto=format&fit=crop&w=1200&q=80",
  // Suite & bath details
  bed: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
  bathroom:
    "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=1200&q=80",
  shower:
    "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1200&q=80",
  tv: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=1200&q=80",
  sink: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80",
  // Bar / cocina
  wine: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=80",
  barShelf:
    "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1200&q=80",
};

// === CAMBIA AQUÍ LA RUTA DE TU LOGO (imagen). Ej: "logo.webp", "img/logo-hacienda.webp" ===
const LOGO_SRC = "images/logo.webp";
const PEDIGREE = [
  {
    name: "Kratos",
    photo: DEER_IMAGES.kratos,
    video: VIDEOS.deer1,
    sire: "Titán",
    dam: "Atenea",
    gp: "Zeus",
    gpd: "Hera",
    gm: "Ares",
    gmd: "Afrodita",
    desc: {
      es: "Nuestro semental insignia. Una cornamenta titánica que supera las 210 pulgadas, con masa y simetría perfectas. Sus crías heredan tamaño, dominancia y presencia. El padre de los gigantes.",
      en: "Our flagship sire. A titanic rack surpassing 210 inches, with flawless mass and symmetry. His offspring inherit size, dominance and presence. The father of giants.",
    },
  },
  {
    name: "Bernie",
    photo: DEER_IMAGES.bernie,
    video: VIDEOS.deer2,
    sire: "Maximus",
    dam: "Luna",
    gp: "Goliat",
    gpd: "Dalila",
    gm: "Trueno",
    gmd: "Centella",
    desc: {
      es: "Pura sangre de campeón. Bernie destaca por la velocidad de crecimiento de su cornamenta y una base genética excepcional. Sus descendientes maduran antes, más grandes y más fuertes.",
      en: "Pure champion blood. Bernie stands out for the growth speed of his rack and an exceptional genetic base. His descendants mature earlier, larger and stronger.",
    },
  },
  {
    name: "Caymus",
    photo: DEER_IMAGES.caymus,
    video: VIDEOS.deer3,
    sire: "Cabernet",
    dam: "Reserva",
    gp: "Barón",
    gpd: "Duquesa",
    gm: "Mistral",
    gmd: "Brisa",
    desc: {
      es: "Elegancia y poder en equilibrio. Reconocido por su tronco profundo y puntas largas y limpias. Las crías de Caymus son codiciadas por su consistencia temporada tras temporada.",
      en: "Elegance and power in balance. Known for his deep main beams and long, clean tines. Caymus offspring are coveted for their consistency season after season.",
    },
  },
  {
    name: "Petrus",
    photo: DEER_IMAGES.petrus,
    video: VIDEOS.deer4,
    sire: "Château",
    dam: "Borgoña",
    gp: "Merlot",
    gpd: "Condesa",
    gm: "Duque",
    gmd: "Syrah",
    desc: {
      es: "Linaje noble de cuernos anchos y abiertos. Petrus aporta envergadura y una corona dramática. Genética premium para criadores que buscan trofeos de exposición.",
      en: "A noble line of wide, open antlers. Petrus brings spread and a dramatic crown. Premium genetics for breeders chasing show-quality trophies.",
    },
  },
  {
    name: "Storm",
    photo: DEER_IMAGES.storm,
    video: VIDEOS.deer2,
    sire: "Huracán",
    dam: "Tormenta",
    gp: "Rayo",
    gpd: "Nube",
    gm: "Ciclón",
    gmd: "Ventisca",
    desc: {
      es: "Indómito y explosivo. Storm transmite un crecimiento agresivo y una cornamenta impredecible y espectacular. Para quienes buscan ese factor sorpresa irrepetible.",
      en: "Untamed and explosive. Storm passes on aggressive growth and an unpredictable, spectacular rack. For those chasing that once-in-a-lifetime surprise factor.",
    },
  },
  {
    name: "Seven",
    photo: DEER_IMAGES.seven,
    video: VIDEOS.deer3,
    sire: "Lucky",
    dam: "Fortuna",
    gp: "As",
    gpd: "Reina",
    gm: "Júpiter",
    gmd: "Venus",
    desc: {
      es: "El número de la suerte. Siete generaciones de selección detrás de cada punta. Seven combina rusticidad, fertilidad y trofeo — el semental más completo.",
      en: "The lucky number. Seven generations of selection behind every tine. Seven blends hardiness, fertility and trophy quality — the most complete sire.",
    },
  },
];
const PEDIGREE_T = {
  es: {
    eyebrow: "Genética de Élite",
    title: "Pedigrí",
    desc: "Nuestros sementales de cría — la genética detrás de los trofeos de Hacienda El Cielo. Vendemos las crías de estos ejemplares. Toque cada semental para ver su historia y su árbol genealógico.",
    contact: "Contáctanos",
    sire: "Padre",
    dam: "Madre",
    gp: "Abuelo paterno",
    gpd: "Abuela paterna",
    gm: "Abuelo materno",
    gmd: "Abuela materna",
    tree: "Árbol genealógico",
    more: "Ver pedigrí →",
    buy: "¿Le interesan las crías de este semental? Podemos venderle descendencia de esta misma línea genética — escríbanos por WhatsApp y con gusto lo coordinamos.",
    wa: "Hola, me interesan las crías del semental ",
  },
  en: {
    eyebrow: "Elite Genetics",
    title: "Pedigree",
    desc: "Our breeding bucks — the genetics behind the trophies of Hacienda El Cielo. We sell the offspring of these sires. Tap each buck to see his story and family tree.",
    contact: "Contact us",
    sire: "Sire",
    dam: "Dam",
    gp: "Paternal grandsire",
    gpd: "Paternal granddam",
    gm: "Maternal grandsire",
    gmd: "Maternal granddam",
    tree: "Family tree",
    more: "View pedigree →",
    buy: "Interested in this buck's offspring? We can sell you descendants of this same bloodline — message us on WhatsApp and we'll gladly arrange it.",
    wa: "Hi, I'm interested in the offspring of ",
  },
};

// Store product imagery — background photo (fails silently if unavailable) + decorative icon.
// Index-aligned with t.tienda.products.
const PRODUCT_MEDIA = [
  {
    icon: "🍷",
    img: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=900&q=80",
  },
  {
    icon: "🍷",
    img: "https://images.unsplash.com/photo-1474722883778-792e7990302f?auto=format&fit=crop&w=900&q=80",
  },
  {
    icon: "🍷",
    img: "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?auto=format&fit=crop&w=900&q=80",
  },
  {
    icon: "🚬",
    img: "https://images.unsplash.com/photo-1527156231393-7023794f363c?auto=format&fit=crop&w=900&q=80",
  },
  {
    icon: "🪵",
    img: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=900&q=80",
  },
  {
    icon: "🧰",
    img: "https://images.unsplash.com/photo-1606293926075-69a00dbfde81?auto=format&fit=crop&w=900&q=80",
  },
  {
    icon: "🥃",
    img: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80",
  },
  {
    icon: "🥃",
    img: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?auto=format&fit=crop&w=900&q=80",
  },
  {
    icon: "🧢",
    img: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=900&q=80",
  },
  {
    icon: "🥤",
    img: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=80",
  },
  {
    icon: "☕",
    img: "https://images.unsplash.com/photo-1577937927133-66ef06acdf18?auto=format&fit=crop&w=900&q=80",
  },
  {
    icon: "🦺",
    img: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=900&q=80",
  },
];

// ============ COMPONENTS ============

function LangToggle({ lang, setLang }) {
  return React.createElement(
    "div",
    {
      className: "lang-toggle-wrap",
    },
    React.createElement(
      "button",
      {
        className: `lang-btn ${lang === "es" ? "active" : ""}`,
        onClick: () => setLang("es"),
        "aria-pressed": lang === "es",
      },
      "ES",
    ),
    React.createElement(
      "button",
      {
        className: `lang-btn ${lang === "en" ? "active" : ""}`,
        onClick: () => setLang("en"),
        "aria-pressed": lang === "en",
      },
      "EN",
    ),
  );
}
function Navbar({ lang, setLang, t }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const links = [
    {
      id: "inicio",
      label: t.nav.home,
    },
    {
      id: "naturaleza",
      label: t.nav.nature,
      sub: [
        {
          id: "caceria-trofeos",
          label: t.hunt.sub_trofeos,
        },
        {
          id: "caceria-paquetes",
          label: t.hunt.packages_title,
        },
        {
          id: "caceria-pedigri",
          label: PEDIGREE_T[lang].title,
        },
      ],
    },
    {
      id: "hacienda",
      label: t.nav.hacienda,
      sub: [
        {
          id: "hacienda-main",
          label: t.nav.hacienda_main,
        },
        {
          id: "hacienda-club",
          label: t.nav.clubhouse,
        },
        {
          id: "hacienda-suites",
          label: t.nav.suites,
        },
        {
          id: "hacienda-cocina",
          label: t.nav.kitchen,
        },
        {
          id: "hacienda-food",
          label: t.nav.dining,
        },
        {
          id: "hacienda-actividades",
          label: t.nav.activities,
        },
      ],
    },
    {
      id: "quienes-somos",
      label: t.nav.about,
    },
    {
      id: "ubicacion",
      label: t.nav.location,
    },
    {
      id: "contacto",
      label: t.nav.contact,
    },
  ];
  return React.createElement(
    React.Fragment,
    null,
    React.createElement(
      "nav",
      {
        className: `fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-forest-900/95 backdrop-blur-md py-3 border-b border-gold-700/30" : "bg-transparent py-5"}`,
      },
      React.createElement(
        "div",
        {
          className: `max-w-7xl mx-auto px-6 flex items-center justify-between ${lang === "es" ? "gap-x-2" : ""}`,
        },
        React.createElement(
          "a",
          {
            href: "#inicio",
            className: "flex items-center gap-3",
          },
          React.createElement("img", {
            src: LOGO_SRC,
            alt: "Hacienda El Cielo",
            className: "h-16 w-auto pb-2",
          }),
          React.createElement(
            "div",
            {
              className: "leading-tight",
            },
            React.createElement(
              "div",
              {
                className: "font-display text-gold-300 text-sm tracking-widest",
              },
              "",
            ),
            React.createElement(
              "div",
              {
                className:
                  "font-display text-gold-400 text-xs tracking-[0.25em]",
              },
              "",
            ),
          ),
        ),
        React.createElement(
          "div",
          {
            className: `hidden lg:flex items-center ${lang === "es" ? "gap-x-14 xl:gap-x-16" : "gap-8"}`,
          },
          links.map((link) =>
            link.sub
              ? React.createElement(
                  "div",
                  {
                    key: link.id,
                    className: "dropdown",
                  },
                  React.createElement(
                    "a",
                    {
                      href: `#${link.id}`,
                      className: "nav-link flex items-center gap-1.5 relative",
                    },
                    React.createElement("span", null, link.label),
                    React.createElement(
                      "span",
                      {
                        className:
                          "text-[0.55rem] font-sans text-gold-500 bg-gold-700/20 border border-gold-700/50 rounded-full px-1.5 py-0.5 leading-none tracking-normal",
                      },
                      link.sub.length,
                    ),
                    React.createElement(
                      "svg",
                      {
                        width: "9",
                        height: "9",
                        viewBox: "0 0 9 9",
                        className:
                          "transition-transform group-hover:rotate-180",
                      },
                      React.createElement("path", {
                        d: "M1 2.5 L4.5 6.5 L8 2.5",
                        stroke: "currentColor",
                        fill: "none",
                        strokeWidth: "1.3",
                      }),
                    ),
                  ),
                  React.createElement(
                    "div",
                    {
                      className: "dropdown-menu",
                    },
                    React.createElement(
                      "div",
                      {
                        className:
                          "px-4 pt-2 pb-1 border-b border-gold-700/20 mb-1",
                      },
                      React.createElement(
                        "span",
                        {
                          className:
                            "font-display text-[0.55rem] tracking-[0.3em] text-gold-500 uppercase",
                        },
                        t.nav.explore,
                      ),
                    ),
                    link.sub.map((s) =>
                      React.createElement(
                        "a",
                        {
                          key: s.id,
                          href: `#${s.id}`,
                        },
                        s.label,
                      ),
                    ),
                  ),
                )
              : React.createElement(
                  "a",
                  {
                    key: link.id,
                    href: `#${link.id}`,
                    className: "nav-link",
                  },
                  link.label,
                ),
          ),
        ),
        React.createElement(
          "div",
          {
            className: "flex items-center gap-4",
          },
          React.createElement(
            "a",
            {
              href: "#reservar",
              className:
                "hidden md:inline-block btn-gold !py-2 !px-4 !text-[0.65rem] mx-4",
            },
            t.nav.reserve,
          ),
          React.createElement(LangToggle, {
            lang: lang,
            setLang: setLang,
          }),
          React.createElement(
            "button",
            {
              className: "lg:hidden text-gold-400",
              onClick: () => setMobileOpen(!mobileOpen),
            },
            React.createElement(
              "svg",
              {
                width: "28",
                height: "28",
                viewBox: "0 0 28 28",
              },
              React.createElement("path", {
                d: "M4 8 H24 M4 14 H24 M4 20 H24",
                stroke: "currentColor",
                strokeWidth: "1.5",
              }),
            ),
          ),
        ),
      ),
    ),
    React.createElement(
      "div",
      {
        className: `mobile-menu fixed top-0 right-0 h-full w-80 bg-forest-900 z-50 lg:hidden ${mobileOpen ? "open" : ""} border-l border-gold-700/30`,
      },
      React.createElement(
        "div",
        {
          className:
            "p-6 border-b border-gold-700/20 flex justify-between items-center",
        },
        React.createElement(
          "span",
          {
            className: "font-display text-gold-400 tracking-widest text-sm",
          },
          t.nav.menu.toUpperCase(),
        ),
        React.createElement(
          "button",
          {
            onClick: () => setMobileOpen(false),
            className: "text-gold-400 text-2xl",
          },
          "\xD7",
        ),
      ),
      React.createElement(
        "div",
        {
          className: "p-6 flex flex-col gap-5",
        },
        links.map((link) =>
          React.createElement(
            "div",
            {
              key: link.id,
            },
            React.createElement(
              "a",
              {
                href: `#${link.id}`,
                onClick: () => setMobileOpen(false),
                className: "nav-link",
              },
              link.label,
            ),
            link.sub &&
              React.createElement(
                "div",
                {
                  className: "ml-4 mt-3 flex flex-col gap-2",
                },
                link.sub.map((s) =>
                  React.createElement(
                    "a",
                    {
                      key: s.id,
                      href: `#${s.id}`,
                      onClick: () => setMobileOpen(false),
                      className: "nav-link !text-[0.6rem] opacity-70",
                    },
                    "\u2014 ",
                    s.label,
                  ),
                ),
              ),
          ),
        ),
      ),
    ),
    mobileOpen &&
      React.createElement("div", {
        onClick: () => setMobileOpen(false),
        className: "fixed inset-0 bg-black/70 z-40 lg:hidden",
      }),
  );
}
function Hero({ t }) {
  return React.createElement(
    "section",
    {
      id: "inicio",
      className:
        "hero-bg min-h-screen flex flex-col items-center justify-center relative pt-20",
    },
    React.createElement("div", {
      className:
        "absolute inset-0 bg-gradient-to-b from-forest-900/40 via-transparent to-forest-900/90",
    }),
    React.createElement(
      "div",
      {
        className: "relative z-10 text-center px-6 max-w-2xl pb-8",
      },
      React.createElement("div", {
        className: "fade-in fade-in-1",
      }),
      React.createElement(
        "h1",
        {
          className:
            "fade-in fade-in-2 display-xl text-cream text-4xl md:text-7xl lg:text-8xl mb-4 leading-[0.95]",
        },
        React.createElement("img", {
          src: LOGO_SRC,
          alt: "Hacienda El Cielo",
          className: "h-auto w-auto pt-20",
        }),
      ),
      React.createElement(
        "div",
        {
          className: "gold-divider mb-8",
        },
        React.createElement(
          "span",
          {
            className: "font-sans text-[0.7rem] tracking-[0.4em] text-gold-400",
          },
          t.hero.eyebrow,
        ),
      ),
      React.createElement(
        "div",
        {
          className: "fade-in fade-in-3 max-w-3xl mx-auto mt-8 mb-12",
        },
        React.createElement(
          "p",
          {
            className:
              "script-accent text-xl md:text-2xl text-cream/90 italic leading-relaxed",
          },
          '"',
          t.hero.tagline,
          '"',
        ),
      ),
      React.createElement(
        "div",
        {
          className:
            "fade-in fade-in-4 flex flex-col sm:flex-row gap-4 justify-center",
        },
        React.createElement(
          "a",
          {
            href: "#reservar",
            className: "btn-gold",
          },
          t.hero.cta1,
        ),
        React.createElement(
          "a",
          {
            href: "#caceria",
            className: "btn-outline",
          },
          t.hero.cta2,
        ),
      ),
    ),
    React.createElement(
      "div",
      {
        className: "bottom-8 left-1/2 flex flex-col items-center gap-2 shimmer",
      },
      React.createElement(
        "span",
        {
          className:
            "font-display text-[0.6rem] tracking-[0.3em] text-gold-400",
        },
        "SCROLL",
      ),
      React.createElement("div", {
        className: "w-px h-12 bg-gold-400",
      }),
    ),
  );
}
function SafetySection({ t }) {
  return React.createElement(
    "section",
    {
      className: "py-24 bg-forest-900 border-y border-gold-700/20 relative",
    },
    React.createElement(
      "div",
      {
        className: "max-w-7xl mx-auto px-6",
      },
      React.createElement(
        "div",
        {
          className: "text-center mb-12",
        },
        React.createElement("div", {
          className: "ornament",
        }),
        React.createElement(
          "p",
          {
            className:
              "font-display text-[0.7rem] tracking-[0.4em] text-gold-400 mb-3",
          },
          t.safety.sub,
        ),
        React.createElement(
          "h2",
          {
            className: "display-xl text-cream text-4xl md:text-5xl mb-8",
          },
          t.safety.title,
        ),
        React.createElement(
          "div",
          {
            className: "max-w-3xl mx-auto space-y-5",
          },
          React.createElement(
            "p",
            {
              className:
                "script-accent text-lg md:text-xl text-cream/90 italic leading-relaxed",
            },
            t.safety.desc1,
          ),
          React.createElement(
            "p",
            {
              className:
                "script-accent text-lg md:text-xl text-cream/85 italic leading-relaxed",
            },
            t.safety.desc2,
          ),
        ),
      ),
      React.createElement(
        "div",
        {
          className: "grid md:grid-cols-3 gap-6",
        },
        [
          {
            stat: t.safety.stat1,
            label: t.safety.stat1_label,
          },
          {
            stat: t.safety.stat2,
            label: t.safety.stat2_label,
          },
          {
            stat: t.safety.stat3,
            label: t.safety.stat3_label,
          },
        ].map((item, i) =>
          React.createElement(
            "div",
            {
              key: i,
              className: "card-luxe p-8 text-center",
            },
            React.createElement(
              "div",
              {
                className:
                  "display-xl text-gold-400 text-5xl md:text-6xl mb-3 stat-num",
              },
              item.stat,
            ),
            React.createElement(
              "div",
              {
                className:
                  "font-sans text-[0.75rem] tracking-[0.2em] uppercase text-cream/70",
              },
              item.label,
            ),
          ),
        ),
      ),
    ),
  );
}
function HowToArriveSection({ t }) {
  const [destHotel, setDestHotel] = useState("hampton");
  const pinLocations = [
    {
      name: "HACIENDA EL CIELO",
      sub: t.safety.pin_hacienda_sub,
      icon: "★",
      featured: true,
      url: "https://www.google.com/maps/search/?api=1&query=28.905717,-101.335331",
    },
  ];
  return React.createElement(
    "section",
    {
      id: "ubicacion",
      className: "arrive-section pt-28 border-y border-gold-700/20",
    },
    React.createElement(
      "div",
      {
        className: "relative max-w-7xl mx-auto px-6 z-10",
      },
      React.createElement(
        "div",
        {
          className: "text-center mb-14",
        },
        React.createElement(
          "div",
          {
            className: "arrive-badge",
          },
          React.createElement("span", null, t.location.eyebrow),
        ),
        React.createElement("div", {
          className: "ornament",
        }),
        React.createElement(
          "h3",
          {
            className: "display-xl text-cream text-3xl md:text-5xl mb-6",
          },
          React.createElement(
            "span",
            {
              className: "arrive-title-wrap",
            },
            t.safety.how_title,
          ),
        ),
        React.createElement(
          "p",
          {
            className:
              "script-accent text-lg text-cream/85 max-w-3xl mx-auto italic leading-relaxed",
          },
          t.safety.how_desc,
        ),
      ),
      React.createElement(
        "div",
        {
          className: "map-frame p-4 md:p-6 mb-14",
        },
        React.createElement(
          "div",
          {
            className: "w-full",
            style: {
              aspectRatio: "16/10",
            },
          },
          React.createElement("iframe", {
            title: `${t.location.title} · Hacienda El Cielo`,
            src: "https://maps.google.com/maps?q=28.905717,-101.335331&t=&z=6&ie=UTF8&iwloc=&output=embed",
            className: "w-full h-full border-0",
            loading: "lazy",
            referrerPolicy: "no-referrer-when-downgrade",
            allowFullScreen: true,
          }),
        ),
        React.createElement(
          "div",
          {
            className: "mt-7 max-w-md mx-auto text-sm",
          },
          pinLocations.map((p, i) =>
            React.createElement(
              "a",
              {
                key: i,
                href: p.url,
                target: "_blank",
                rel: "noopener",
                className: "pin-card",
                title: `${t.safety.open_in_maps}: ${p.name}`,
              },
              React.createElement(
                "div",
                {
                  className: `pin-icon ${p.featured ? "featured" : "standard"} font-display text-xs`,
                },
                p.icon,
              ),
              React.createElement(
                "div",
                {
                  className: "min-w-0",
                },
                React.createElement(
                  "div",
                  {
                    className:
                      "font-display text-cream text-xs tracking-widest truncate",
                  },
                  p.name,
                ),
                React.createElement(
                  "div",
                  {
                    className:
                      "font-serif italic text-cream/60 text-xs truncate",
                  },
                  p.sub,
                ),
              ),
              React.createElement(
                "svg",
                {
                  className: "pin-arrow flex-shrink-0",
                  width: "16",
                  height: "16",
                  viewBox: "0 0 16 16",
                },
                React.createElement("path", {
                  d: "M4 8 L12 8 M8 4 L12 8 L8 12",
                  stroke: "currentColor",
                  fill: "none",
                  strokeWidth: "1.5",
                }),
              ),
            ),
          ),
        ),
      ),
      React.createElement(
        "div",
        {
          className: "card-luxe p-8 md:p-10 mb-16",
        },
        React.createElement(
          "div",
          {
            className: "text-center mb-6",
          },
          React.createElement(
            "div",
            {
              className:
                "font-display text-[0.65rem] tracking-[0.3em] text-gold-400 mb-2",
            },
            "\u2605 \u2605 \u2605 \u2605",
          ),
          React.createElement(
            "h3",
            {
              className:
                "font-display text-cream text-xl md:text-2xl tracking-widest mb-3",
            },
            t.safety.hotel_title,
          ),
          React.createElement(
            "p",
            {
              className:
                "font-serif italic text-cream/80 max-w-2xl mx-auto leading-relaxed",
            },
            t.safety.hotel_desc,
          ),
        ),
        React.createElement(
          "div",
          {
            className: "grid md:grid-cols-2 gap-4 max-w-3xl mx-auto",
          },
          t.safety.hotels.map((h, i) =>
            React.createElement(
              "div",
              {
                key: i,
                className: "hotel-card p-5 text-center",
              },
              React.createElement(
                "div",
                {
                  className:
                    "font-display text-[0.6rem] tracking-[0.3em] text-gold-400 mb-1",
                },
                t.safety.recommended.toUpperCase(),
              ),
              React.createElement(
                "div",
                {
                  className:
                    "font-display text-cream text-sm md:text-base tracking-wider",
                },
                h.name,
              ),
            ),
          ),
        ),
      ),
      React.createElement(
        "div",
        {
          className: "mb-16",
        },
        React.createElement(
          "div",
          {
            className: "flex items-center justify-center gap-4 mb-8",
          },
          React.createElement("span", {
            className:
              "h-px w-12 bg-gradient-to-r from-transparent to-gold-500",
          }),
          React.createElement(
            "h3",
            {
              className:
                "font-display text-gold-400 text-xs tracking-[0.4em] flex items-center gap-2",
            },
            React.createElement(
              "svg",
              {
                width: "18",
                height: "18",
                viewBox: "0 0 24 24",
                fill: "currentColor",
              },
              React.createElement("path", {
                d: "M5 17h-2v-6.4l-1.4-.4 .8-2.4 2.4 .8 .7-2c .25-.7 .9-1.6 2.5-1.6h8c 1.6 0 2.25 .9 2.5 1.6l .7 2 2.4 -.8 .8 2.4 -1.4 .4v6.4h-2v-1h-14v1zm14-3v-3h-14v3h14zm-9-7l-.7 2h11.4l-.7-2h-10z",
              }),
            ),
            t.safety.by_car,
          ),
          React.createElement("span", {
            className:
              "h-px w-12 bg-gradient-to-l from-transparent to-gold-500",
          }),
        ),
        React.createElement(
          "div",
          {
            className:
              "flex flex-col sm:flex-row items-center justify-center gap-3 mb-8",
          },
          React.createElement(
            "span",
            {
              className:
                "font-display text-[0.65rem] tracking-[0.3em] text-gold-400 uppercase",
            },
            t.safety.dest_label,
            ":",
          ),
          React.createElement(
            "div",
            {
              className:
                "inline-flex border border-gold-700/40 rounded-full overflow-hidden",
            },
            [
              {
                id: "hampton",
                label: "Hampton by Hilton",
              },
              {
                id: "hyatt",
                label: "Hyatt Place",
              },
            ].map((h) =>
              React.createElement(
                "button",
                {
                  key: h.id,
                  onClick: () => setDestHotel(h.id),
                  className: `font-display text-[0.7rem] tracking-[0.2em] uppercase px-4 py-2 transition-colors ${destHotel === h.id ? "bg-gold-700/40 text-gold-200" : "text-cream/70 hover:text-cream"}`,
                },
                h.label,
              ),
            ),
          ),
        ),
        React.createElement(
          "div",
          {
            className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-4",
          },
          t.safety.car_routes.map((r, i) =>
            React.createElement(
              "a",
              {
                key: i,
                href: r.mapUrls[destHotel],
                target: "_blank",
                rel: "noopener",
                className: "route-card block",
                title: `${t.safety.open_in_maps}: ${r.city}`,
              },
              React.createElement(
                "div",
                {
                  className: "flex items-start justify-between gap-3 mb-2",
                },
                React.createElement(
                  "h4",
                  {
                    className:
                      "font-display text-cream text-base tracking-wider hover:text-gold-300 transition",
                  },
                  r.city,
                ),
                React.createElement(
                  "span",
                  {
                    className:
                      "font-display text-[0.6rem] tracking-[0.2em] text-gold-400 border border-gold-700 px-2 py-0.5 whitespace-nowrap",
                  },
                  r.time,
                ),
              ),
              React.createElement(
                "p",
                {
                  className:
                    "font-serif italic text-cream/75 text-sm leading-relaxed mb-3",
                },
                r.desc,
              ),
              React.createElement(
                "div",
                {
                  className:
                    "font-display text-[0.55rem] tracking-[0.3em] text-gold-500 uppercase flex items-center gap-1",
                },
                React.createElement("span", null, t.safety.view_on_map),
                React.createElement("span", null, "\u2197"),
              ),
            ),
          ),
        ),
        React.createElement(
          "div",
          {
            className:
              "mt-7 border-l-2 border-gold-400 bg-forest-700/40 p-5 max-w-3xl mx-auto",
          },
          React.createElement(
            "p",
            {
              className:
                "font-serif italic text-cream/90 text-base leading-relaxed text-center",
            },
            React.createElement(
              "span",
              {
                className:
                  "font-display text-gold-300 text-[0.7rem] tracking-[0.3em] uppercase block mb-2",
              },
              t.safety.transfer_label,
            ),
            t.safety.car_transfer_note,
          ),
        ),
      ),
      React.createElement(
        "div",
        {
          className: "mb-16",
        },
        React.createElement(
          "div",
          {
            className: "flex items-center justify-center gap-4 mb-8",
          },
          React.createElement("span", {
            className:
              "h-px w-12 bg-gradient-to-r from-transparent to-gold-500",
          }),
          React.createElement(
            "h3",
            {
              className:
                "font-display text-gold-400 text-xs tracking-[0.4em] flex items-center gap-2",
            },
            React.createElement(
              "svg",
              {
                width: "18",
                height: "18",
                viewBox: "0 0 24 24",
                fill: "currentColor",
              },
              React.createElement("path", {
                d: "M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z",
              }),
            ),
            t.safety.by_air,
          ),
          React.createElement("span", {
            className:
              "h-px w-12 bg-gradient-to-l from-transparent to-gold-500",
          }),
        ),
        React.createElement(
          "div",
          {
            className: "grid md:grid-cols-3 gap-4 mb-6",
          },
          t.safety.airports.map((a, i) =>
            React.createElement(
              "div",
              {
                key: i,
                className: "airport-card",
              },
              React.createElement(
                "span",
                {
                  className: "airport-plane",
                },
                "\u2708",
              ),
              React.createElement(
                "h4",
                {
                  className:
                    "font-display text-cream text-base mb-3 tracking-wider",
                },
                a.name,
              ),
              React.createElement(
                "p",
                {
                  className:
                    "font-serif italic text-cream/75 text-sm leading-relaxed",
                },
                a.desc,
              ),
            ),
          ),
        ),
        React.createElement(
          "div",
          {
            className:
              "border-l-2 border-gold-400 bg-forest-700/40 p-5 max-w-3xl mx-auto",
          },
          React.createElement(
            "p",
            {
              className:
                "font-serif italic text-cream/90 text-base leading-relaxed text-center",
            },
            React.createElement(
              "span",
              {
                className:
                  "font-display text-gold-300 text-[0.7rem] tracking-[0.3em] uppercase block mb-2",
              },
              t.safety.by_air,
            ),
            t.safety.transfer_note,
          ),
        ),
      ),
    ),
  );
}
function NatureSection({ t }) {
  const row1 = NATURE_IMAGES.slice(0, 20);
  const row2 = NATURE_IMAGES.slice(20);

  function CarouselRow({ images, direction }) {
    const doubled = [...images, ...images];
    return React.createElement(
      "div",
      {
        className: "carousel-mask",
        style: { overflow: "hidden", width: "100%", marginBottom: "12px" },
      },
      React.createElement(
        "div",
        {
          className:
            direction === "ltr" ? "carousel-track-ltr" : "carousel-track-rtl",
          style: { display: "flex", gap: "12px" },
        },
        doubled.map((src, i) =>
          React.createElement(
            "div",
            {
              key: i,
              style: {
                flexShrink: 0,
                width: "380px",
                height: "300px",
                borderRadius: "6px",
                overflow: "hidden",
              },
            },
            React.createElement("img", {
              src: src,
              loading: "lazy",
              decoding: "async",
              alt: "",
              style: {
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              },
            }),
          ),
        ),
      ),
    );
  }

  return React.createElement(
    "section",
    {
      id: "naturaleza",
      className: "section-bg-trees pt-32 pb-22",
    },
    React.createElement(
      "div",
      {
        className: "max-w-7xl mx-auto px-6",
      },
      React.createElement(
        "div",
        { className: "text-center mb-16" },
        React.createElement("div", { className: "ornament" }),
        React.createElement(
          "p",
          {
            className:
              "font-display text-[0.7rem] tracking-[0.4em] text-gold-400 mb-3",
          },
          t.nature.eyebrow.toUpperCase(),
        ),
        React.createElement(
          "h2",
          { className: "display-xl text-cream text-4xl md:text-6xl mb-6" },
          t.nature.title,
        ),
        React.createElement(
          "p",
          {
            className:
              "script-accent text-lg md:text-xl text-cream/80 max-w-3xl mx-auto italic leading-relaxed",
          },
          t.nature.desc,
        ),
      ),
    ),
    React.createElement(
      "div",
      { style: { marginTop: "0", paddingBottom: "3rem" } },
      React.createElement(CarouselRow, { images: row1, direction: "ltr" }),
      React.createElement(CarouselRow, { images: row2, direction: "rtl" }),
    ),
  );
}
function HuntSection({ t, lang }) {
  return React.createElement(
    "section",
    {
      id: "caceria",
      className: "section-bg-hunt py-32",
    },
    React.createElement(
      "div",
      {
        className: "max-w-7xl mx-auto px-6",
      },
      React.createElement(
        "div",
        {
          className: "text-center mb-16",
        },
        React.createElement(
          "h3",
          {
            id: "caceria-trofeos",
            className:
              "font-display text-gold-300 text-2xl md:text-3xl tracking-widest mb-4 scroll-mt-28",
          },
          t.hunt.title,
        ),
        React.createElement(
          "p",
          {
            className:
              "script-accent text-lg md:text-xl text-cream/80 max-w-3xl mx-auto italic leading-relaxed",
          },
          t.hunt.desc,
        ),
        React.createElement(
          "div",
          {
            className:
              "mt-10 inline-flex flex-col sm:flex-row gap-4 sm:gap-8 border-t border-b border-gold-700/30 py-4 px-8",
          },
          React.createElement(
            "span",
            {
              className:
                "font-display text-[1rem] tracking-[0.3em] text-gold-400",
            },
            t.hunt.seasons.toUpperCase(),
          ),
          React.createElement(
            "span",
            {
              className: "font-serif text-cream/80 italic",
            },
            t.hunt.season_deer,
          ),
          React.createElement(
            "span",
            {
              className: "font-serif text-cream/80 italic",
            },
            t.hunt.season_turkey,
          ),
        ),
      ),
      React.createElement(
        "div",
        {
          className: "photo-frame h-96 mb-6",
        },
        React.createElement("img", {
          src: PHOTOS.deer2,
          loading: "lazy",
          decoding: "async",
          alt: "Trophy deer",
        }),
      ),
      React.createElement(
        "div",
        {
          className: "grid grid-cols-2 md:grid-cols-3 gap-6 mb-16",
        },
        [
          PHOTOS.deer1,
          PHOTOS.deer3,
          PHOTOS.turkey,
          PHOTOS.birds,
          PHOTOS.wildlife,
          PHOTOS.mountains,
        ].map((src, i) =>
          React.createElement(
            "div",
            {
              key: i,
              className: "photo-frame h-80",
            },
            React.createElement("img", {
              src: src,
              loading: "lazy",
              decoding: "async",
              alt: "",
            }),
          ),
        ),
      ),
      React.createElement(
        "h3",
        {
          id: "caceria-paquetes",
          className:
            "font-display text-gold-400 text-xs tracking-[0.4em] text-center mb-8 scroll-mt-28",
        },
        t.hunt.packages_title.toUpperCase(),
      ),
      React.createElement(
        "div",
        {
          className: "grid md:grid-cols-3 gap-6 mb-16",
        },
        t.packages.map((pkg, i) =>
          React.createElement(
            "div",
            {
              key: i,
              className: "card-luxe pkg-card overflow-hidden flex flex-col",
            },
            React.createElement(
              "div",
              {
                className: "photo-frame h-56",
              },
              React.createElement("img", {
                src: [
                  PACKAGES_IMAGES.cercaAlta,
                  PACKAGES_IMAGES.cercaBaja,
                  PACKAGES_IMAGES.guajolote,
                ][i],
                loading: "lazy",
                decoding: "async",
                alt: pkg.name,
              }),
            ),
            React.createElement(
              "div",
              {
                className: "p-6 flex flex-col flex-1",
              },
              React.createElement(
                "div",
                {
                  className:
                    "font-sans text-[0.65rem] tracking-[0.3em] text-gold-400 uppercase mb-1",
                },
                pkg.sub,
              ),
              React.createElement(
                "h4",
                {
                  className:
                    "font-display text-cream text-xl mb-3 tracking-wider",
                },
                pkg.name,
              ),
              React.createElement(
                "p",
                {
                  className:
                    "font-serif text-cream/75 italic text-sm mb-4 leading-relaxed",
                },
                pkg.desc,
              ),
              React.createElement(
                "ul",
                {
                  className: "text-cream/70 text-xs space-y-1 mb-4 font-sans",
                },
                pkg.includes.map((inc, j) =>
                  React.createElement(
                    "li",
                    {
                      key: j,
                      className: "flex items-start gap-2",
                    },
                    !inc.startsWith("↳") &&
                      React.createElement(
                        "span",
                        {
                          className: "text-gold-500 mt-0.5",
                        },
                        "\u25C6",
                      ),
                    React.createElement(
                      "span",
                      {
                        className: inc.startsWith("↳") ? "ml-5" : "",
                      },
                      inc,
                    ),
                  ),
                ),
              ),
              React.createElement(
                "div",
                {
                  className:
                    "mt-auto pt-4 border-t border-gold-700/30 flex items-end justify-between",
                },
                React.createElement(
                  "div",
                  null,
                  React.createElement(
                    "div",
                    {
                      className: "font-display text-gold-300 text-2xl",
                    },
                    pkg.price,
                  ),
                  React.createElement(
                    "div",
                    {
                      className:
                        "font-sans text-[0.6rem] tracking-[0.3em] text-cream/60",
                    },
                    pkg.unit,
                  ),
                ),
                React.createElement(
                  "a",
                  {
                    href: "#reservar",
                    className: "btn-gold !py-2 !px-3 !text-[0.6rem]",
                  },
                  t.hunt.booking_cta,
                ),
              ),
            ),
          ),
        ),
      ),
      React.createElement(
        "div",
        {
          className: "card-luxe pkg-card overflow-hidden grid md:grid-cols-2",
        },
        React.createElement(
          "div",
          {
            className: "photo-frame h-72 md:h-full md:min-h-[400px]",
          },
          React.createElement("img", {
            src: PACKAGES_IMAGES.cazador,
            loading: "lazy",
            decoding: "async",
            alt: "",
          }),
        ),
        React.createElement(
          "div",
          {
            className: "p-8 md:p-12 flex flex-col justify-center",
          },
          React.createElement(
            "h3",
            {
              className:
                "display-xl text-cream text-xl sm:text-2xl md:text-4xl mb-2",
            },
            t.hunt.photo_title,
          ),
          React.createElement(
            "div",
            {
              className:
                "font-sans text-[0.7rem] tracking-[0.3em] text-gold-400 uppercase mb-4",
            },
            t.hunt.photo_eyebrow,
          ),
          React.createElement(
            "p",
            {
              className:
                "font-serif text-cream/80 italic text-sm sm:text-base md:text-lg leading-relaxed",
            },
            t.hunt.photo_desc,
          ),
          React.createElement(
            "ul",
            {
              className: "text-cream/70 text-xs space-y-1 mt-4 font-sans",
            },
            t.hunt.photo_includes.map((inc, j) =>
              React.createElement(
                "li",
                {
                  key: j,
                  className: "flex items-start gap-2",
                },
                !inc.startsWith("↳") &&
                  React.createElement(
                    "span",
                    {
                      className: "text-gold-500 mt-0.5",
                    },
                    "◆",
                  ),
                React.createElement(
                  "span",
                  {
                    className: inc.startsWith("↳") ? "ml-5" : "",
                  },
                  inc,
                ),
              ),
            ),
          ),
          React.createElement(
            "div",
            {
              className:
                "mt-6 pt-5 border-t border-gold-700/30 flex items-center justify-between gap-2 sm:gap-4",
            },

            // Contenedor del precio
            React.createElement(
              "div",
              null,

              React.createElement(
                "div",
                {
                  className:
                    "font-display text-gold-400 text-xl sm:text-2xl md:text-4xl",
                },
                t.hunt.photo_price,
              ),

              React.createElement(
                "div",
                {
                  className:
                    "text-[10px] sm:text-xs text-cream/60 tracking-[0.2em] uppercase",
                },
                "USD",
                // o t.hunt.photo_unit
              ),
            ),

            // Botón
            React.createElement(
              "a",
              {
                href: "#reservar",
                className:
                  "btn-gold whitespace-nowrap text-[10px] sm:text-xs md:text-sm px-2 sm:px-4 md:px-6 py-2",
              },
              t.hunt.booking_cta,
            ),
          ),
        ),
      ),
      React.createElement(
        "div",
        {
          className:
            "card-luxe mt-14 p-8 md:p-10 text-center max-w-3xl mx-auto",
        },
        React.createElement(
          "div",
          {
            className:
              "font-display text-gold-400 text-[0.7rem] tracking-[0.4em] uppercase mb-3",
          },
          t.hunt.garantia_title,
        ),
        React.createElement(
          "p",
          {
            className:
              "font-serif italic text-cream/85 text-base md:text-lg leading-relaxed",
          },
          t.hunt.garantia_desc,
        ),
      ),
    ),
  );
}
function HaciendaSection({ t }) {
  const [tab, setTab] = useState("main");
  const tabs = [
    {
      id: "main",
      label: t.hacienda_section.tabs.main,
      anchor: "hacienda-main",
    },
    {
      id: "club",
      label: t.hacienda_section.tabs.club,
      anchor: "hacienda-club",
    },
    {
      id: "suites",
      label: t.hacienda_section.tabs.suites,
      anchor: "hacienda-suites",
    },
    {
      id: "cocina",
      label: t.hacienda_section.tabs.cocina,
      anchor: "hacienda-cocina",
    },
    {
      id: "food",
      label: t.hacienda_section.tabs.food,
      anchor: "hacienda-food",
    },
    {
      id: "actividades",
      label: t.hacienda_section.tabs.actividades,
      anchor: "hacienda-actividades",
    },
  ];

  // Listen to hash for anchor jumping
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace("#", "");
      const found = tabs.find((t) => t.anchor === hash);
      if (found) setTab(found.id);
    };
    window.addEventListener("hashchange", handleHash);
    handleHash();
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);
  return React.createElement(
    "section",
    {
      id: "hacienda",
      className: "section-bg-hacienda py-32",
    },
    React.createElement(
      "div",
      {
        className: "max-w-7xl mx-auto px-6",
      },
      React.createElement(
        "div",
        {
          className: "text-center mb-12",
        },
        React.createElement("div", {
          className: "ornament",
        }),
        React.createElement(
          "p",
          {
            className:
              "font-display text-[0.7rem] tracking-[0.4em] text-gold-400 mb-3",
          },
          t.hacienda_section.eyebrow.toUpperCase(),
        ),
        React.createElement(
          "h2",
          {
            className: "display-xl text-cream text-4xl md:text-6xl mb-6",
          },
          t.hacienda_section.title,
        ),
        React.createElement(
          "p",
          {
            className:
              "script-accent text-lg md:text-xl text-cream/80 max-w-3xl mx-auto italic leading-relaxed",
          },
          t.hacienda_section.desc,
        ),
      ),
      React.createElement(
        "div",
        {
          className: "flex flex-wrap justify-center gap-3 mb-12 pb-6",
        },
        tabs.map((t_, idx) =>
          React.createElement(
            "button",
            {
              key: t_.id,
              onClick: () => {
                setTab(t_.id);
                window.history.replaceState(null, "", `#${t_.anchor}`);
              },
              className: `group relative font-display text-[0.7rem] border-gold-500 text-gold-300 tracking-[0.25em] px-5 py-3 transition-all border ${tab === t_.id ? "text-cream bg-gold-700/30" : "text-cream/70 hover:border-gold-500 hover:text-gold-300"}`,
            },

            t_.label.toUpperCase(),
            tab === t_.id &&
              React.createElement("span", {
                className: "",
              }),
          ),
        ),
      ),
      tab === "main" &&
        React.createElement(
          "div",
          {
            id: "hacienda-main",
          },
          React.createElement(
            "div",
            {
              className: "grid md:grid-cols-2 gap-10 items-center mb-8",
            },
            React.createElement(
              "div",
              {
                className: "photo-frame h-96 relative overflow-hidden",
                onMouseEnter: (e) => {
                  const video = e.currentTarget.querySelector("video");
                  video.style.opacity = 1;
                  video.play();
                },
                onMouseLeave: (e) => {
                  const video = e.currentTarget.querySelector("video");
                  video.pause();
                  video.currentTime = 0;
                  video.style.opacity = 0;
                },
              },

              // Imagen
              React.createElement("img", {
                src: PHOTOS.hacienda_ext,
                loading: "lazy",
                decoding: "async",
                alt: "",
                className: "absolute inset-0 w-full h-full object-cover",
              }),

              // Video
              React.createElement(
                "video",
                {
                  className:
                    "absolute inset-0 w-full h-full object-cover transition-opacity duration-300 opacity-0",
                  muted: true,
                  loop: true,
                  playsInline: true,
                },
                React.createElement("source", {
                  src: VIDEOS.hacienda_ext_video,
                  type: "video/mp4",
                }),
              ),
            ),
            /*React.createElement(
              "div",
              {
                className: "photo-frame h-96",
              },
              React.createElement("img", {
                src: PHOTOS.hacienda_ext,
                alt: "",
              }),
            ),*/
            React.createElement(
              "div",
              null,
              React.createElement(
                "h3",
                {
                  className:
                    "font-display text-cream text-3xl mb-6 tracking-widest",
                },
                t.hacienda_section.tabs.main,
              ),
              React.createElement(
                "p",
                {
                  className:
                    "font-serif text-cream/85 text-lg leading-relaxed italic",
                },
                t.hacienda_section.main_desc,
              ),
            ),
          ),
          React.createElement(
            "div",
            {
              className: "grid md:grid-cols-3 gap-4",
            },
            React.createElement(
              "div",
              {
                className: "photo-frame h-64",
              },
              React.createElement("img", {
                src: PHOTOS.hacienda_ext2,
                loading: "lazy",
                decoding: "async",
                alt: "",
              }),
            ),
            React.createElement(
              "div",
              {
                className: "photo-frame h-64",
              },
              React.createElement("img", {
                src: PHOTOS.hacienda_ext3,
                loading: "lazy",
                decoding: "async",
                alt: "",
              }),
            ),
            React.createElement(
              "div",
              {
                className: "photo-frame h-64",
              },
              React.createElement("img", {
                src: PHOTOS.hacienda_ext4,
                loading: "lazy",
                decoding: "async",
                alt: "",
              }),
            ),
          ),
          React.createElement("div", {
            className: "grid md:grid-cols-3 gap-4 mt-4",
          }),
        ),
      tab === "club" &&
        React.createElement(
          "div",
          {
            id: "hacienda-club",
          },
          React.createElement(
            "div",
            {
              className: "grid md:grid-cols-2 gap-10 items-center mb-8",
            },
            React.createElement(
              "div",
              null,
              React.createElement(
                "h3",
                {
                  className:
                    "font-display text-cream text-3xl mb-6 tracking-widest",
                },
                t.hacienda_section.tabs.club,
              ),
              React.createElement(
                "p",
                {
                  className:
                    "font-serif text-cream/85 text-lg leading-relaxed italic",
                },
                t.hacienda_section.club_desc,
              ),
            ),
            React.createElement(
              "div",
              {
                className: "photo-frame h-96 relative overflow-hidden",
                onMouseEnter: (e) => {
                  const video = e.currentTarget.querySelector("video");
                  video.style.opacity = 1;
                  video.play();
                },
                onMouseLeave: (e) => {
                  const video = e.currentTarget.querySelector("video");
                  video.pause();
                  video.currentTime = 0;
                  video.style.opacity = 0;
                },
              },

              // Imagen
              React.createElement("img", {
                src: PHOTOS.diningRoom,
                loading: "lazy",
                decoding: "async",
                alt: "",
                className: "absolute inset-0 w-full h-full object-cover",
              }),

              // Video
              React.createElement(
                "video",
                {
                  className:
                    "absolute inset-0 w-full h-full object-cover transition-opacity duration-300 opacity-0",
                  muted: true,
                  loop: true,
                  playsInline: true,
                },
                React.createElement("source", {
                  src: VIDEOS.clubhouse,
                  type: "video/mp4",
                }),
              ),
            ),
            /*React.createElement(
              "div",
              {
                className: "photo-frame h-96",
              },
              React.createElement("img", {
                src: PHOTOS.bar,
                alt: "",
              }),
            ),*/
          ),
          React.createElement(
            "div",
            {
              className: "grid md:grid-cols-3 gap-4",
            },
            React.createElement(
              "div",
              {
                className: "photo-frame h-64",
              },
              React.createElement("img", {
                src: PHOTOS.barCH,
                loading: "lazy",
                decoding: "async",
                alt: "",
              }),
            ),
            React.createElement(
              "div",
              {
                className: "photo-frame h-64",
              },
              React.createElement("img", {
                src: PHOTOS.kitchen,
                loading: "lazy",
                decoding: "async",
                alt: "",
              }),
            ),
            React.createElement(
              "div",
              {
                className: "photo-frame h-64",
              },
              React.createElement("img", {
                src: PHOTOS.livingRoom,
                loading: "lazy",
                decoding: "async",
                alt: "",
              }),
            ),
            React.createElement(
              "div",
              {
                className: "photo-frame h-64",
              },
              React.createElement("img", {
                src: PHOTOS.wine,
                loading: "lazy",
                decoding: "async",
                alt: "",
              }),
            ),
            React.createElement(
              "div",
              {
                className: "photo-frame h-64",
              },
              React.createElement("img", {
                src: PHOTOS.barShelf,
                loading: "lazy",
                decoding: "async",
                alt: "",
              }),
            ),
            React.createElement(
              "div",
              {
                className: "photo-frame h-64",
              },
              React.createElement("img", {
                src: PHOTOS.fire,
                loading: "lazy",
                decoding: "async",
                alt: "",
              }),
            ),
          ),
        ),
      tab === "suites" &&
        React.createElement(
          "div",
          {
            id: "hacienda-suites",
          },
          React.createElement(
            "div",
            {
              className: "grid md:grid-cols-2 gap-10 items-center mb-12",
            },
            React.createElement(
              "div",
              {
                className: "photo-frame h-96 relative overflow-hidden",
                onMouseEnter: (e) => {
                  const video = e.currentTarget.querySelector("video");
                  video.style.opacity = 1;
                  video.play();
                },
                onMouseLeave: (e) => {
                  const video = e.currentTarget.querySelector("video");
                  video.pause();
                  video.currentTime = 0;
                  video.style.opacity = 0;
                },
              },

              // Imagen
              React.createElement("img", {
                src: PHOTOS.suite,
                loading: "lazy",
                decoding: "async",
                alt: "",
                className: "absolute inset-0 w-full h-full object-cover",
              }),

              // Video
              React.createElement(
                "video",
                {
                  className:
                    "absolute inset-0 w-full h-full object-cover transition-opacity duration-300 opacity-0",
                  muted: true,
                  loop: true,
                  playsInline: true,
                },
                React.createElement("source", {
                  src: VIDEOS.suite1,
                  type: "video/mp4",
                }),
              ),
            ),
            /*React.createElement(
              "div",
              {
                className: "photo-frame h-80",
              },
              React.createElement("img", {
                src: PHOTOS.suite,
                alt: "",
              }),
            ),*/
            React.createElement(
              "div",
              null,
              React.createElement(
                "h3",
                {
                  className:
                    "font-display text-cream text-3xl mb-6 tracking-widest",
                },
                t.hacienda_section.tabs.suites,
              ),
              React.createElement(
                "p",
                {
                  className:
                    "font-serif text-cream/85 text-lg leading-relaxed italic mb-6",
                },
                t.hacienda_section.suites_desc,
              ),
              React.createElement(
                "ul",
                {
                  className: "space-y-2",
                },
                t.hacienda_section.suites_features.map((f, i) =>
                  React.createElement(
                    "li",
                    {
                      key: i,
                      className: "flex items-center gap-3 text-cream/80",
                    },
                    React.createElement(
                      "span",
                      {
                        className: "text-gold-400",
                      },
                      "\u25C6",
                    ),
                    React.createElement(
                      "span",
                      {
                        className: "font-sans text-sm",
                      },
                      f,
                    ),
                  ),
                ),
              ),
            ),
          ),
          React.createElement(
            "div",
            {
              className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-6",
            },
            t.suites.map((s, i) =>
              React.createElement(
                "div",
                {
                  key: i,
                  className: "card-luxe overflow-hidden group",
                },
                React.createElement(
                  "div",
                  {
                    className: "photo-frame h-56",
                  },
                  React.createElement("img", {
                    src: [
                      PHOTOS.suite,
                      PHOTOS.suite2,
                      PHOTOS.suite3,
                      PHOTOS.suite4,
                      PHOTOS.suite5,
                      PHOTOS.banosuite,
                    ][i],
                    loading: "lazy",
                    decoding: "async",
                    alt: "Suite",
                  }),
                ),
              ),
            ),
          ),
        ),
      tab === "food" &&
        React.createElement(
          "div",
          {
            id: "hacienda-food",
          },
          React.createElement(
            "div",
            {
              className: "grid md:grid-cols-2 gap-10 items-center mb-8",
            },
            React.createElement(
              "div",
              {
                className: "photo-frame h-96 relative overflow-hidden",
                onMouseEnter: (e) => {
                  const video = e.currentTarget.querySelector("video");
                  video.style.opacity = 1;
                  video.play();
                },
                onMouseLeave: (e) => {
                  const video = e.currentTarget.querySelector("video");
                  video.pause();
                  video.currentTime = 0;
                  video.style.opacity = 0;
                },
              },

              // Imagen
              React.createElement("img", {
                src: PHOTOS.Bar,
                loading: "lazy",
                decoding: "async",
                alt: "",
                className: "absolute inset-0 w-full h-full object-cover",
              }),

              // Video
              React.createElement(
                "video",
                {
                  className:
                    "absolute inset-0 w-full h-full object-cover transition-opacity duration-300 opacity-0",
                  muted: true,
                  loop: true,
                  playsInline: true,
                },
                React.createElement("source", {
                  src: VIDEOS.bar,
                  type: "video/mp4",
                }),
              ),
            ),
            /*React.createElement(
              "div",
              {
                className: "photo-frame h-96",
              },
              React.createElement("img", {
                src: PHOTOS.wine,
                alt: "",
              }),
            ),*/
            React.createElement(
              "div",
              null,
              React.createElement(
                "h3",
                {
                  className:
                    "font-display text-cream text-3xl mb-6 tracking-widest",
                },
                t.hacienda_section.tabs.food,
              ),
              React.createElement(
                "p",
                {
                  className:
                    "font-serif text-cream/85 text-lg leading-relaxed italic",
                },
                t.hacienda_section.food_desc,
              ),
            ),
          ),
          React.createElement(
            "div",
            {
              className: "grid md:grid-cols-3 gap-4",
            },
            React.createElement(
              "div",
              {
                className: "photo-frame h-64",
              },
              React.createElement("img", {
                src: PHOTOS.botellasVino,
                loading: "lazy",
                decoding: "async",
                alt: "",
              }),
            ),
            React.createElement(
              "div",
              {
                className: "photo-frame h-64",
              },
              React.createElement("img", {
                src: PHOTOS.mesaPool,
                loading: "lazy",
                decoding: "async",
                alt: "",
              }),
            ),
            React.createElement(
              "div",
              {
                className: "photo-frame h-64",
              },
              React.createElement("img", {
                src: PHOTOS.mezcal,
                loading: "lazy",
                decoding: "async",
                alt: "",
              }),
            ),
            React.createElement(
              "div",
              {
                className: "photo-frame h-64",
              },
              React.createElement("img", {
                src: PHOTOS.whiskey,
                loading: "lazy",
                decoding: "async",
                alt: "",
              }),
            ),
            React.createElement(
              "div",
              {
                className: "photo-frame h-64",
              },
              React.createElement("img", {
                src: PHOTOS.bar2,
                loading: "lazy",
                decoding: "async",
                alt: "",
              }),
            ),
            React.createElement(
              "div",
              {
                className: "photo-frame h-64",
              },
              React.createElement("img", {
                src: PHOTOS.bar3,
                loading: "lazy",
                decoding: "async",
                alt: "",
              }),
            ),
          ),
        ),
      tab === "cocina" &&
        React.createElement(
          "div",
          {
            id: "hacienda-cocina",
          },
          React.createElement(
            "div",
            {
              className: "grid md:grid-cols-2 gap-10 items-center mb-8",
            },
            React.createElement(
              "div",
              {
                className: "photo-frame h-96 relative overflow-hidden",
                onMouseEnter: (e) => {
                  const video = e.currentTarget.querySelector("video");
                  video.style.opacity = 1;
                  video.play();
                },
                onMouseLeave: (e) => {
                  const video = e.currentTarget.querySelector("video");
                  video.pause();
                  video.currentTime = 0;
                  video.style.opacity = 0;
                },
              },

              // Imagen
              React.createElement("img", {
                src: PHOTOS.kitchen,
                loading: "lazy",
                decoding: "async",
                alt: "",
                className: "absolute inset-0 w-full h-full object-cover",
              }),

              // Video
              React.createElement(
                "video",
                {
                  className:
                    "absolute inset-0 w-full h-full object-cover transition-opacity duration-300 opacity-0",
                  muted: true,
                  loop: true,
                  playsInline: true,
                },
                React.createElement("source", {
                  src: VIDEOS.kitchen,
                  type: "video/mp4",
                }),
              ),
            ),
            /*React.createElement(
              "div",
              {
                className: "photo-frame h-96",
              },
              React.createElement("img", {
                src: PHOTOS.food,
                alt: "",
              }),
            ),*/
            React.createElement(
              "div",
              null,
              React.createElement(
                "h3",
                {
                  className:
                    "font-display text-cream text-3xl mb-6 tracking-widest",
                },
                t.hacienda_section.tabs.cocina,
              ),
              React.createElement(
                "p",
                {
                  className:
                    "font-serif text-cream/85 text-lg leading-relaxed italic",
                },
                t.hacienda_section.cocina_desc,
              ),
            ),
          ),
          React.createElement(
            "div",
            {
              className: "grid md:grid-cols-3 gap-4",
            },
            React.createElement(
              "div",
              {
                className: "photo-frame h-64",
              },
              React.createElement("img", {
                src: PHOTOS.food,
                loading: "lazy",
                decoding: "async",
                alt: "",
              }),
            ),
            React.createElement(
              "div",
              {
                className: "photo-frame h-64",
              },
              React.createElement("img", {
                src: PHOTOS.food2,
                loading: "lazy",
                decoding: "async",
                alt: "",
              }),
            ),
            React.createElement(
              "div",
              {
                className: "photo-frame h-64",
              },
              React.createElement("img", {
                src: PHOTOS.food3,
                loading: "lazy",
                decoding: "async",
                alt: "",
              }),
            ),
            React.createElement(
              "div",
              {
                className: "photo-frame h-64",
              },
              React.createElement("img", {
                src: PHOTOS.food4,
                loading: "lazy",
                decoding: "async",
                alt: "",
              }),
            ),
            React.createElement(
              "div",
              {
                className: "photo-frame h-64",
              },
              React.createElement("img", {
                src: PHOTOS.food5,
                loading: "lazy",
                decoding: "async",
                alt: "",
              }),
            ),
            React.createElement(
              "div",
              {
                className: "photo-frame h-64",
              },
              React.createElement("img", {
                src: PHOTOS.food6,
                loading: "lazy",
                decoding: "async",
                alt: "",
              }),
            ),
          ),
        ),
      tab === "actividades" &&
        React.createElement(
          "div",
          {
            id: "hacienda-actividades",
          },
          React.createElement(
            "div",
            {
              className: "text-center mb-8",
            },
            React.createElement(
              "h3",
              {
                className:
                  "font-display text-cream text-3xl mb-4 tracking-widest",
              },
              t.hacienda_section.activities_title,
            ),
            React.createElement(
              "p",
              {
                className:
                  "font-serif text-cream/85 text-lg leading-relaxed italic max-w-3xl mx-auto",
              },
              t.hacienda_section.act_desc,
            ),
          ),
          React.createElement(
            "div",
            {
              className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-6",
            },
            t.hacienda_section.activities.map((a, i) =>
              React.createElement(
                "div",
                {
                  key: i,
                  className: "card-luxe overflow-hidden",
                },
                React.createElement(
                  "div",
                  {
                    className: "photo-frame h-56 relative overflow-hidden",
                    onMouseEnter: (e) => {
                      const video = e.currentTarget.querySelector("video");
                      video.style.opacity = 1;
                      video.play();
                    },
                    onMouseLeave: (e) => {
                      const video = e.currentTarget.querySelector("video");
                      video.pause();
                      video.currentTime = 0;
                      video.style.opacity = 0;
                    },
                  },

                  // Imagen
                  React.createElement("img", {
                    src: [
                      ACTIVITIES.hiking,
                      PHOTOS.shooting,
                      PHOTOS.fishing,
                      PHOTOS.cornhole,
                      ACTIVITIES.starry_skies,
                      ACTIVITIES.wildlife,
                    ][i],
                    loading: "lazy",
                    decoding: "async",
                    alt: a.name,
                    className: "absolute inset-0 w-full h-full object-cover",
                  }),

                  // Video
                  React.createElement(
                    "video",
                    {
                      className:
                        "absolute inset-0 w-full h-full object-cover transition-opacity duration-300 opacity-0",
                      muted: true,
                      loop: true,
                      playsInline: true,
                    },
                    React.createElement("source", {
                      src: [
                        VIDEOS.hiking,
                        VIDEOS.shooting,
                        VIDEOS.fishing,
                        VIDEOS.outdoorGames,
                        VIDEOS.campfires,
                        VIDEOS.wildlife,
                      ][i],
                      type: "video/mp4",
                    }),
                  ),
                ),
                /*React.createElement(
                  "div",
                  {
                    className: "photo-frame h-56",
                  },
                  React.createElement("img", {
                    src: [
                      PHOTOS.hiking,
                      PHOTOS.shooting,
                      PHOTOS.fishing,
                      PHOTOS.cornhole,
                      PHOTOS.campfire,
                      PHOTOS.wildlife,
                    ][i],
                    alt: a.name,
                  }),
                ),*/
                React.createElement(
                  "div",
                  {
                    className: "p-6",
                  },
                  React.createElement(
                    "div",
                    {
                      className:
                        "font-sans text-[0.6rem] tracking-[0.3em] text-gold-400 uppercase mb-2",
                    },
                    String(i + 1).padStart(2, "0"),
                  ),
                  React.createElement(
                    "h4",
                    {
                      className:
                        "font-display text-cream text-xl mb-3 tracking-wider",
                    },
                    a.name,
                  ),
                  React.createElement(
                    "p",
                    {
                      className:
                        "font-serif italic text-cream/75 text-base leading-relaxed",
                    },
                    a.desc,
                  ),
                ),
              ),
            ),
          ),
        ),
    ),
  );
}
function ActivitiesSection({ t }) {
  return React.createElement(
    "section",
    {
      id: "actividades",
      className: "section-bg-activities py-32 border-t border-gold-700/20",
    },
    React.createElement(
      "div",
      {
        className: "max-w-7xl mx-auto px-6",
      },
      React.createElement(
        "div",
        {
          className: "text-center mb-12",
        },
        React.createElement("div", {
          className: "ornament",
        }),
        React.createElement(
          "p",
          {
            className:
              "font-display text-[0.7rem] tracking-[0.4em] text-gold-400 mb-3",
          },
          t.hacienda_section.activities_eyebrow,
        ),
        React.createElement(
          "h2",
          {
            className: "display-xl text-cream text-4xl md:text-6xl mb-6",
          },
          t.hacienda_section.activities_title,
        ),
        React.createElement(
          "p",
          {
            className:
              "script-accent text-lg md:text-xl text-cream/80 max-w-3xl mx-auto italic leading-relaxed",
          },
          t.hacienda_section.act_desc,
        ),
      ),
      React.createElement(
        "div",
        {
          className: "grid sm:grid-cols-2 lg:grid-cols-3 gap-6",
        },
        t.hacienda_section.activities.map((a, i) =>
          React.createElement(
            "div",
            {
              key: i,
              className: "card-luxe overflow-hidden",
            },
            React.createElement(
              "div",
              {
                className: "photo-frame h-56",
              },
              React.createElement("img", {
                src: [
                  PHOTOS.hiking,
                  PHOTOS.shooting,
                  PHOTOS.fishing,
                  PHOTOS.cornhole,
                  PHOTOS.campfire,
                  PHOTOS.wildlife,
                ][i],
                loading: "lazy",
                decoding: "async",
                alt: a.name,
              }),
            ),
            React.createElement(
              "div",
              {
                className: "p-6",
              },
              React.createElement(
                "div",
                {
                  className:
                    "font-sans text-[0.6rem] tracking-[0.3em] text-gold-400 uppercase mb-2",
                },
                String(i + 1).padStart(2, "0"),
              ),
              React.createElement(
                "h4",
                {
                  className:
                    "font-display text-cream text-xl mb-3 tracking-wider",
                },
                a.name,
              ),
              React.createElement(
                "p",
                {
                  className:
                    "font-serif italic text-cream/75 text-base leading-relaxed",
                },
                a.desc,
              ),
            ),
          ),
        ),
      ),
    ),
  );
}
function AboutSection({ t }) {
  return React.createElement(
    "section",
    {
      id: "quienes-somos",
      className: "section-bg-family py-32",
    },
    React.createElement(
      "div",
      {
        className: "max-w-6xl mx-auto px-6",
      },
      React.createElement(
        "div",
        {
          className: "text-center mb-12",
        },
        React.createElement("div", {
          className: "ornament",
        }),
        React.createElement(
          "p",
          {
            className:
              "font-display text-[0.7rem] tracking-[0.4em] text-gold-400 mb-3",
          },
          t.about.eyebrow.toUpperCase(),
        ),
        React.createElement(
          "h2",
          {
            className: "display-xl text-cream text-4xl md:text-6xl mb-6",
          },
          t.about.title,
        ),
      ),
      React.createElement(
        "div",
        {
          className: "grid md:grid-cols-12 gap-10 mb-12",
        },
        React.createElement(
          "div",
          {
            className: "md:col-span-5",
          },
          React.createElement(
            "div",
            {
              className: "photo-frame h-[500px] sticky top-24",
            },
            React.createElement("img", {
              src: HISTORIA.history,
              loading: "lazy",
              decoding: "async",
              alt: "",
            }),
          ),
        ),
        React.createElement(
          "div",
          {
            className: "md:col-span-7 space-y-6",
          },
          React.createElement(
            "p",
            {
              className:
                "font-serif text-cream/85 text-lg leading-relaxed italic first-letter:font-display first-letter:text-5xl first-letter:text-gold-400 first-letter:float-left first-letter:mr-3 first-letter:leading-none",
            },
            t.about.p1,
          ),
          React.createElement(
            "p",
            {
              className:
                "font-serif text-cream/85 text-lg leading-relaxed italic",
            },
            t.about.p2,
          ),
          React.createElement(
            "p",
            {
              className:
                "font-serif text-cream/85 text-lg leading-relaxed italic",
            },
            t.about.p3,
          ),
          React.createElement(
            "p",
            {
              className:
                "font-serif text-cream/85 text-lg leading-relaxed italic",
            },
            t.about.legacy,
          ),
        ),
      ),
      React.createElement(
        "div",
        {
          className:
            "grid sm:grid-cols-2 gap-8 my-12 py-8 border-y border-gold-700/30 text-center",
        },
        React.createElement(
          "div",
          null,
          React.createElement(
            "p",
            {
              className:
                "font-display text-[0.65rem] tracking-[0.4em] text-gold-400 uppercase mb-2",
            },
            t.about.est_label,
          ),
          React.createElement(
            "div",
            {
              className:
                "display-xl text-gold-400 text-6xl md:text-7xl leading-none",
            },
            "1930",
          ),
          React.createElement(
            "p",
            {
              className:
                "script-accent text-cream/80 italic text-sm md:text-base mt-3",
            },
            t.about.est_sub,
          ),
        ),
        React.createElement(
          "div",
          null,
          React.createElement(
            "p",
            {
              className:
                "font-display text-[0.65rem] tracking-[0.4em] text-gold-400 uppercase mb-2",
            },
            t.about.foss_label,
          ),
          React.createElement(
            "div",
            {
              className:
                "display-xl text-gold-400 text-5xl md:text-6xl leading-none",
            },
            t.about.foss_big,
          ),
          React.createElement(
            "p",
            {
              className:
                "script-accent text-cream/80 italic text-sm md:text-base mt-3",
            },
            t.about.foss_sub,
          ),
        ),
      ),
      React.createElement(
        "div",
        {
          className: "grid grid-cols-2 md:grid-cols-4 gap-4 mb-8",
        },
        React.createElement(
          "div",
          {
            className: "photo-frame h-56",
          },
          React.createElement("img", {
            src: PHOTOS.deer1,
            loading: "lazy",
            decoding: "async",
            alt: "",
          }),
        ),
        React.createElement(
          "div",
          {
            className: "photo-frame h-56",
          },
          React.createElement("img", {
            src: PHOTOS.hacienda_ext2,
            loading: "lazy",
            decoding: "async",
            alt: "",
          }),
        ),
        React.createElement(
          "div",
          {
            className: "photo-frame h-56",
          },
          React.createElement("img", {
            src: PHOTOS.hacienda_ext3,
            loading: "lazy",
            decoding: "async",
            alt: "",
          }),
        ),
        React.createElement(
          "div",
          {
            className: "photo-frame h-56",
          },
          React.createElement("img", {
            src: PHOTOS.mountains,
            loading: "lazy",
            decoding: "async",
            alt: "",
          }),
        ),
      ),
    ),
  );
}
function ReservationSection({ t, lang }) {
  const [month, setMonth] = useState("");
  const [days, setDays] = useState(3);
  const nights = Math.max(1, days - 1);
  const [hunters, setHunters] = useState([
    {
      name: "",
      age: "",
      pkgs: [""],
      suite: "",
      idFile: null,
    },
  ]);
  const [companions, setCompanions] = useState([]);
  const [transport, setTransport] = useState("");
  const [hotelPN, setHotelPN] = useState("");
  const [notes, setNotes] = useState("");

  const packageOptions = t.packages.map((p) => ({
    value: p.name,
    label: `${p.name} — ${p.price}`,
    priceNum: parseInt(p.price.replace(/[$,]/g, ""), 10),
    depositNum: p.deposit || 0,
  }));
  packageOptions.push({
    value: "photo",
    label: `${t.hunt.photo_title} — ${t.hunt.photo_price}`,
    priceNum: 2500,
    depositNum: 1250,
  });
  const addHunter = () => {
    if (hunters.length + companions.length < 6)
      setHunters([
        ...hunters,
        {
          name: "",
          age: "",
          pkgs: [""],
          suite: "",
          idFile: null,
        },
      ]);
  };
  const removeHunter = (i) => setHunters(hunters.filter((_, idx) => idx !== i));
  const updateHunter = (i, field, val) => {
    const nh = [...hunters];
    nh[i][field] = val;
    setHunters(nh);
  };
  const addCompanion = () => {
    if (hunters.length + companions.length < 6)
      setCompanions([
        ...companions,
        {
          name: "",
          age: "",
          idFile: null,
        },
      ]);
  };
  const removeCompanion = (i) =>
    setCompanions(companions.filter((_, idx) => idx !== i));
  const updateCompanion = (i, field, val) => {
    const nc = [...companions];
    nc[i][field] = val;
    setCompanions(nc);
  };

  // Calculate estimate
  const calcTotal = () => {
    let total = 0;
    hunters.forEach((h) => {
      // Each hunter can have up to 2 packages — both add to the total
      (h.pkgs || []).forEach((pkgVal) => {
        const opt = packageOptions.find((o) => o.value === pkgVal);
        if (opt) total += opt.priceNum;
      });
      // Lodging is included in hunting packages — no extra charge for the suite.
    });
    companions.forEach((c) => {
      const age = parseInt(c.age, 10);
      if (isNaN(age)) return;
      if (age < 13)
        return; // free under 13
      else if (age < 18) total += 150 * nights;
      else total += 350 * nights;
    });
    return total;
  };
  const calcDeposit = () => {
    return Math.round(calcTotal() * 0.3);
  };
  const buildMessage = () => {
    const L =
      lang === "es"
        ? {
            title: "NUEVA RESERVACIÓN — HACIENDA EL CIELO",
            dates: "Fechas",
            month: "Mes preferido",
            hunters: "CAZADORES",
            comp: "ACOMPAÑANTES",
            suite: "Suite",
            notes: "Notas",
            total: "Estimado",
            deposit: "Anticipo (20%)",
            pkg: "Paquete",
            age: "Edad",
            transport: "Cómo llega",
            hotel: "Hotel en Piedras Negras",
            id_ok: "ID adjunta ✓",
            id_pending: "ID pendiente — enviar por separado",
            id_note:
              "Identificaciones: por favor envíelas también por WhatsApp o email para completar la reservación.",
          }
        : {
            title: "NEW RESERVATION — HACIENDA EL CIELO",
            dates: "Dates",
            month: "Preferred month",
            hunters: "HUNTERS",
            comp: "COMPANIONS",
            suite: "Suite",
            notes: "Notes",
            total: "Estimate",
            deposit: "Deposit (20%)",
            pkg: "Package",
            age: "Age",
            transport: "Arrival method",
            hotel: "Hotel in Piedras Negras",
            id_ok: "ID attached ✓",
            id_pending: "ID pending — send separately",
            id_note:
              "IDs: please also send them via WhatsApp or email to complete the reservation.",
          };
    const transportLabel =
      t.reserve.transport_opts.find((o) => o.value === transport)?.label || "—";
    const hotelLabel =
      t.reserve.hotel_pn_opts.find((o) => o.value === hotelPN)?.label || "—";
    let msg = `*${L.title}*\n\n`;
    msg += `📅 ${L.month}: ${month || "—"}\n`;
    msg += `🌙 ${L.days}: ${days} (${nights} ${lang === "es" ? "noches" : "nights"})\n\n`;
    msg += `*${L.hunters}*\n`;
    hunters.forEach((h, i) => {
      msg += `${i + 1}. ${h.name || "—"} (${L.age}: ${h.age || "—"})\n`;
      msg += `   ${L.pkg}: ${h.pkgs && h.pkgs.filter((p) => p).length ? h.pkgs.filter((p) => p).join(" + ") : "—"}\n`;
      msg += `   ID: ${h.idFile ? L.id_ok + " (" + h.idFile.name + ")" : L.id_pending}\n`;
    });
    if (companions.length > 0) {
      msg += `\n*${L.comp}*\n`;
      companions.forEach((c, i) => {
        const age = parseInt(c.age, 10);
        let rate = lang === "es" ? "Gratis" : "Free";
        if (!isNaN(age)) {
          if (age >= 18) rate = "$350/" + (lang === "es" ? "noche" : "night");
          else if (age >= 13)
            rate = "$150/" + (lang === "es" ? "noche" : "night");
        }
        msg += `${i + 1}. ${c.name || "—"} (${L.age}: ${c.age || "—"}) — ${rate}\n`;
        msg += `   ID: ${c.idFile ? L.id_ok + " (" + c.idFile.name + ")" : L.id_pending}\n`;
      });
    }
    msg += `\n🚗 ${L.transport}: ${transportLabel}\n`;
    msg += `🏨 ${L.hotel}: ${hotelLabel}\n`;
    if (notes) msg += `\n📝 ${L.notes}: ${notes}\n`;
    msg += `\n💰 ${L.total}: $${calcTotal().toLocaleString()} USD\n`;
    msg += `💵 ${L.deposit}: $${calcDeposit().toLocaleString()} USD\n`;
    msg += `\n⚠️ ${L.id_note}`;
    return msg;
  };
  const saveReservation = () => {
    try {
      const transportLabel =
        t.reserve.transport_opts.find((o) => o.value === transport)?.label ||
        "—";
      const hotelLabel =
        t.reserve.hotel_pn_opts.find((o) => o.value === hotelPN)?.label || "—";
      const total = calcTotal();
      const rec = {
        ts: new Date().toLocaleString(),
        client: (hunters[0] && hunters[0].name) || "—",
        month: month,
        days: days,
        nights: nights,
        hunters: hunters.map((h) => ({
          name: h.name,
          age: h.age,
          packages: (h.pkgs || []).filter((p) => p),
        })),
        companions: companions.map((c) => ({ name: c.name, age: c.age })),
        packages: hunters.reduce(
          (acc, h) => acc.concat((h.pkgs || []).filter((p) => p)),
          [],
        ),
        hotel: hotelLabel,
        arrival_method: transportLabel,
        notes: notes,
        total: total,
        deposit: calcDeposit(),
        paid: false,
      };
      const list = JSON.parse(localStorage.getItem("hec_reservations") || "[]");
      list.push(rec);
      localStorage.setItem("hec_reservations", JSON.stringify(list));
      if (RESERVATION_WEBHOOK) {
        fetch(RESERVATION_WEBHOOK, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify(rec),
        }).catch(() => {});
      }
    } catch (e) {}
  };
  const sendWhatsApp = () => {
    saveReservation();
    const msg = buildMessage();
    const phone = "5218441234567"; // stock number
    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`,
      "_blank",
    );
  };
  const sendEmail = () => {
    saveReservation();
    const msg = buildMessage();
    const subj =
      lang === "es"
        ? "Solicitud de Reservación - Hacienda El Cielo"
        : "Reservation Request - Hacienda El Cielo";
    window.location.href = `mailto:Haciendaelcielo@gmail.com?subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(msg)}`;
  };
  const sendSMS = () => {
    saveReservation();
    const msg = buildMessage();
    const phone = "+5218441234567";
    // sms: URI works on iOS (Messages/iMessage) and Android (default SMS app)
    const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
    const sep = isIOS ? "&" : "?";
    window.location.href = `sms:${phone}${sep}body=${encodeURIComponent(msg)}`;
  };
  return React.createElement(
    "section",
    {
      id: "reservar",
      className: "reserve-bg py-32",
    },
    React.createElement("div", {
      className: "reserve-orb-2",
    }),
    React.createElement(
      "div",
      {
        className: "relative max-w-5xl mx-auto px-6 z-10",
      },
      React.createElement(
        "div",
        {
          className: "text-center mb-12",
        },
        React.createElement("div", {
          className: "ornament",
        }),
        React.createElement(
          "p",
          {
            className:
              "font-display text-[0.7rem] tracking-[0.4em] text-gold-400 mb-3",
          },
          t.reserve.eyebrow.toUpperCase(),
        ),
        React.createElement(
          "h2",
          {
            className: "display-xl text-cream text-4xl md:text-6xl mb-6",
          },
          t.reserve.title,
        ),
        React.createElement(
          "p",
          {
            className:
              "script-accent text-lg md:text-xl text-cream/80 max-w-3xl mx-auto italic leading-relaxed",
          },
          t.reserve.desc,
        ),
      ),
      React.createElement(
        "div",
        {
          className: "card-luxe p-8 md:p-12",
        },
        React.createElement(
          "div",
          {
            className: "mb-6",
          },
          React.createElement(
            "h3",
            {
              className:
                "font-display text-gold-400 text-sm tracking-[0.3em] mb-4",
            },
            t.reserve.dates.toUpperCase(),
          ),
          React.createElement(
            "div",
            {
              className: "space-y-4",
            },
            React.createElement(
              "div",
              null,
              React.createElement(
                "label",
                {
                  className: "luxe-label",
                },
                t.reserve.month_q,
              ),
              React.createElement(
                "select",
                {
                  className: "luxe-input",
                  value: month,
                  onChange: (e) => setMonth(e.target.value),
                },
                React.createElement(
                  "option",
                  {
                    value: "",
                  },
                  t.reserve.select,
                ),
                t.reserve.months.map((m, mi) =>
                  React.createElement(
                    "option",
                    {
                      key: mi,
                      value: m,
                    },
                    m,
                  ),
                ),
              ),
            ),
            React.createElement(
              "p",
              {
                className:
                  "font-serif italic text-cream/70 text-sm leading-relaxed",
              },
              t.reserve.dates_followup,
            ),
          ),
        ),
        React.createElement(
          "div",
          {
            className: "border-l-2 border-gold-400 bg-forest-700/40 p-5 mb-10",
          },
          React.createElement(
            "div",
            {
              className:
                "font-display text-gold-300 text-[0.7rem] tracking-[0.3em] uppercase mb-3 flex items-center gap-2",
            },
            React.createElement(
              "span",
              {
                className: "text-gold-400",
              },
              "\u25C6",
            ),
            t.reserve.dates_info_title,
          ),
          React.createElement(
            "ul",
            {
              className: "space-y-2",
            },
            t.reserve.dates_info.map((info, i) =>
              React.createElement(
                "li",
                {
                  key: i,
                  className: "flex items-start gap-3 text-cream/85",
                },
                React.createElement(
                  "span",
                  {
                    className: "text-gold-400 mt-0.5 text-xs",
                  },
                  "\u25B8",
                ),
                React.createElement(
                  "span",
                  {
                    className: "font-serif italic text-base leading-relaxed",
                  },
                  info,
                ),
              ),
            ),
          ),
        ),
        React.createElement(
          "div",
          {
            className: "mb-10",
          },
          React.createElement(
            "h3",
            {
              className:
                "font-display text-gold-400 text-sm tracking-[0.3em] mb-3",
            },
            t.reserve.hunters.toUpperCase(),
          ),
          React.createElement(
            "p",
            {
              className:
                "font-serif italic text-cream/70 text-base mb-4 leading-relaxed",
            },
            t.reserve.suite_per_hunter_note,
          ),
          React.createElement(
            "div",
            {
              className: "space-y-4",
            },
            hunters.map((h, i) =>
              React.createElement(
                "div",
                {
                  key: i,
                  className: "border-l-2 border-gold-700/40 pl-5 py-2",
                },
                React.createElement(
                  "div",
                  {
                    className: "flex justify-between items-center mb-3",
                  },
                  React.createElement(
                    "span",
                    {
                      className:
                        "font-display text-cream text-sm tracking-widest",
                    },
                    "\u25B8 ",
                    t.reserve.hunter_n,
                    " ",
                    i + 1,
                  ),
                  hunters.length > 1 &&
                    React.createElement(
                      "button",
                      {
                        onClick: () => removeHunter(i),
                        className:
                          "text-cream/60 hover:text-cream text-xs font-sans",
                      },
                      "\xD7 ",
                      t.reserve.remove,
                    ),
                ),
                React.createElement(
                  "div",
                  {
                    className: "space-y-3 mb-3",
                  },
                  React.createElement(
                    "div",
                    null,
                    React.createElement(
                      "label",
                      {
                        className: "luxe-label",
                      },
                      t.reserve.name,
                    ),
                    React.createElement("input", {
                      type: "text",
                      className: "luxe-input",
                      value: h.name,
                      onChange: (e) => updateHunter(i, "name", e.target.value),
                    }),
                  ),
                  React.createElement(
                    "div",
                    null,
                    React.createElement(
                      "label",
                      {
                        className: "luxe-label",
                      },
                      t.reserve.age,
                    ),
                    React.createElement("input", {
                      type: "number",
                      min: "1",
                      className: "luxe-input",
                      value: h.age,
                      onChange: (e) => updateHunter(i, "age", e.target.value),
                    }),
                  ),
                ),
                React.createElement(
                  "div",
                  {
                    className: "mb-3",
                  },
                  React.createElement(
                    "label",
                    {
                      className: "luxe-label",
                    },
                    t.reserve.package,
                  ),
                  React.createElement(
                    "div",
                    {
                      className: "space-y-2",
                    },
                    (h.pkgs || [""]).map((pkgVal, pIdx) =>
                      React.createElement(
                        "div",
                        {
                          key: pIdx,
                          className: "flex gap-2",
                        },
                        React.createElement(
                          "select",
                          {
                            className: "luxe-input flex-1",
                            value: pkgVal,
                            onChange: (e) => {
                              const newPkgs = [...(h.pkgs || [""])];
                              newPkgs[pIdx] = e.target.value;
                              updateHunter(i, "pkgs", newPkgs);
                            },
                          },
                          React.createElement(
                            "option",
                            {
                              value: "",
                            },
                            t.reserve.select,
                          ),
                          packageOptions.map((o) =>
                            React.createElement(
                              "option",
                              {
                                key: o.value,
                                value: o.value,
                              },
                              o.label,
                            ),
                          ),
                        ),
                        (h.pkgs || []).length > 1 &&
                          React.createElement(
                            "button",
                            {
                              onClick: () => {
                                const newPkgs = (h.pkgs || [""]).filter(
                                  (_, idx) => idx !== pIdx,
                                );
                                updateHunter(
                                  i,
                                  "pkgs",
                                  newPkgs.length ? newPkgs : [""],
                                );
                              },
                              className:
                                "text-cream/60 hover:text-cream text-xs font-sans px-2 border border-gold-700/30 hover:border-gold-500",
                              title: t.reserve.remove_pkg,
                            },
                            "\xD7",
                          ),
                      ),
                    ),
                    (h.pkgs || [""]).length < 3 &&
                      React.createElement(
                        "button",
                        {
                          onClick: () =>
                            updateHunter(i, "pkgs", [...(h.pkgs || [""]), ""]),
                          className:
                            "font-display text-[0.6rem] tracking-[0.2em] text-gold-400 hover:text-gold-300 transition uppercase",
                        },
                        t.reserve.add_pkg,
                      ),
                  ),
                ),
                React.createElement(
                  "div",
                  null,
                  React.createElement(
                    "label",
                    {
                      className: "luxe-label",
                    },
                    t.reserve.id_upload,
                  ),
                  React.createElement(
                    "div",
                    {
                      className: "flex items-center gap-3",
                    },
                    React.createElement(
                      "label",
                      {
                        className:
                          "btn-gold !py-2 !px-3 !text-[0.6rem] cursor-pointer",
                      },
                      React.createElement("input", {
                        type: "file",
                        accept:
                          "image/png,image/jpeg,image/jpg,application/pdf",
                        className: "hidden",
                        onChange: (e) =>
                          updateHunter(i, "idFile", e.target.files[0] || null),
                      }),
                      h.idFile ? t.reserve.id_change : t.reserve.id_upload_btn,
                    ),
                    h.idFile
                      ? React.createElement(
                          "span",
                          {
                            className:
                              "font-sans text-cream/80 text-xs flex items-center gap-2",
                          },
                          React.createElement(
                            "span",
                            {
                              className: "text-green-400",
                            },
                            "\u2713",
                          ),
                          React.createElement(
                            "span",
                            {
                              className: "truncate max-w-[200px]",
                            },
                            h.idFile.name,
                          ),
                        )
                      : React.createElement(
                          "span",
                          {
                            className: "font-serif italic text-cream text-xs",
                          },
                          t.reserve.id_upload_note,
                        ),
                  ),
                ),
              ),
            ),
            hunters.length + companions.length < 6
              ? React.createElement(
                  "button",
                  {
                    onClick: addHunter,
                    className: "btn-gold w-full",
                  },
                  t.reserve.add_hunter,
                )
              : React.createElement(
                  "p",
                  {
                    className:
                      "text-center font-display text-[0.65rem] tracking-[0.2em] text-gold-500 italic uppercase py-3 border border-gold-700/20",
                  },
                  t.reserve.max_reached,
                ),
          ),
        ),
        React.createElement(
          "div",
          {
            className: "mb-10",
          },
          React.createElement(
            "h3",
            {
              className:
                "font-display text-gold-400 text-sm tracking-[0.3em] mb-3",
            },
            t.reserve.companions.toUpperCase(),
          ),
          React.createElement(
            "p",
            {
              className:
                "font-serif italic text-cream/70 text-base mb-4 leading-relaxed",
            },
            t.reserve.companions_desc,
          ),
          React.createElement(
            "div",
            {
              className: "space-y-4",
            },
            companions.map((c, i) => {
              const age = parseInt(c.age, 10);
              let rateLabel = "";
              let breakdown = "";
              const nightsLabel =
                lang === "es"
                  ? nights === 1
                    ? "noche"
                    : "noches"
                  : nights === 1
                    ? "night"
                    : "nights";
              if (!isNaN(age)) {
                if (age < 13) {
                  rateLabel = t.reserve.under10;
                } else if (age < 18) {
                  rateLabel = t.reserve.teen;
                  breakdown = `$150 × ${nights} ${nightsLabel} = $${(150 * nights).toLocaleString()}`;
                } else {
                  rateLabel = t.reserve.adult;
                  breakdown = `$350 × ${nights} ${nightsLabel} = $${(350 * nights).toLocaleString()}`;
                }
              }
              return React.createElement(
                "div",
                {
                  key: i,
                  className: "border-l-2 border-gold-700/40 pl-5 py-2",
                },
                React.createElement(
                  "div",
                  {
                    className: "flex justify-between items-center mb-3",
                  },
                  React.createElement(
                    "span",
                    {
                      className:
                        "font-display text-cream text-sm tracking-widest",
                    },
                    "\u25B8 ",
                    t.reserve.comp_n,
                    " ",
                    i + 1,
                  ),
                  React.createElement(
                    "button",
                    {
                      onClick: () => removeCompanion(i),
                      className:
                        "text-cream/60 hover:text-cream text-xs font-sans",
                    },
                    "\xD7 ",
                    t.reserve.remove,
                  ),
                ),
                React.createElement(
                  "div",
                  {
                    className: "space-y-3 mb-3",
                  },
                  React.createElement(
                    "div",
                    null,
                    React.createElement(
                      "label",
                      {
                        className: "luxe-label",
                      },
                      t.reserve.name,
                    ),
                    React.createElement("input", {
                      type: "text",
                      className: "luxe-input",
                      value: c.name,
                      onChange: (e) =>
                        updateCompanion(i, "name", e.target.value),
                    }),
                  ),
                  React.createElement(
                    "div",
                    null,
                    React.createElement(
                      "label",
                      {
                        className: "luxe-label",
                      },
                      t.reserve.age,
                    ),
                    React.createElement("input", {
                      type: "number",
                      min: "0",
                      className: "luxe-input",
                      value: c.age,
                      onChange: (e) =>
                        updateCompanion(i, "age", e.target.value),
                    }),
                  ),
                  rateLabel &&
                    React.createElement(
                      "div",
                      null,
                      React.createElement(
                        "div",
                        {
                          className:
                            "font-display text-gold-400 text-[0.7rem] tracking-[0.15em]",
                        },
                        rateLabel,
                      ),
                      breakdown &&
                        React.createElement(
                          "div",
                          {
                            className: "font-sans text-cream/70 text-xs mt-1",
                          },
                          breakdown,
                        ),
                    ),
                ),
                React.createElement(
                  "div",
                  null,
                  React.createElement(
                    "label",
                    {
                      className: "luxe-label",
                    },
                    t.reserve.id_upload,
                  ),
                  React.createElement(
                    "div",
                    {
                      className: "flex items-center gap-3",
                    },
                    React.createElement(
                      "label",
                      {
                        className:
                          "btn-gold !py-2 !px-3 !text-[0.6rem] cursor-pointer",
                      },
                      React.createElement("input", {
                        type: "file",
                        accept:
                          "image/png,image/jpeg,image/jpg,application/pdf",
                        className: "hidden",
                        onChange: (e) =>
                          updateCompanion(
                            i,
                            "idFile",
                            e.target.files[0] || null,
                          ),
                      }),
                      c.idFile ? t.reserve.id_change : t.reserve.id_upload_btn,
                    ),
                    c.idFile
                      ? React.createElement(
                          "span",
                          {
                            className:
                              "font-sans text-cream/80 text-xs flex items-center gap-2",
                          },
                          React.createElement(
                            "span",
                            {
                              className: "text-green-400",
                            },
                            "\u2713",
                          ),
                          React.createElement(
                            "span",
                            {
                              className: "truncate max-w-[200px]",
                            },
                            c.idFile.name,
                          ),
                        )
                      : React.createElement(
                          "span",
                          {
                            className: "font-serif italic text-cream text-xs",
                          },
                          t.reserve.id_upload_note,
                        ),
                  ),
                ),
              );
            }),
            hunters.length + companions.length < 6
              ? React.createElement(
                  "button",
                  {
                    onClick: addCompanion,
                    className: "btn-gold w-full",
                  },
                  t.reserve.add_comp,
                )
              : React.createElement(
                  "p",
                  {
                    className:
                      "text-center font-display text-[0.65rem] tracking-[0.2em] text-gold-500 italic uppercase py-3 border border-gold-700/20",
                  },
                  t.reserve.max_reached,
                ),
          ),
        ),
        React.createElement(
          "div",
          {
            className: "mb-10",
          },
          React.createElement(
            "h3",
            {
              className:
                "font-display text-gold-400 text-sm tracking-[0.3em] mb-3",
            },
            t.reserve.transport.toUpperCase(),
          ),
          React.createElement(
            "p",
            {
              className:
                "font-serif italic text-cream/70 text-base mb-4 leading-relaxed",
            },
            t.reserve.transport_desc,
          ),
          React.createElement(
            "div",
            {
              className: "space-y-2",
            },
            t.reserve.transport_opts.map((opt, i) =>
              React.createElement(
                "label",
                {
                  key: i,
                  className: `flex items-center gap-3 py-2 px-1 cursor-pointer border-b border-gold-700/15 last:border-0 transition-colors ${transport === opt.value ? "text-gold-300" : "text-cream/90 hover:text-cream"}`,
                },
                React.createElement("input", {
                  type: "radio",
                  name: "transport",
                  value: opt.value,
                  checked: transport === opt.value,
                  onChange: (e) => setTransport(e.target.value),
                  className: "accent-gold-400",
                }),
                React.createElement(
                  "span",
                  {
                    className: "font-sans text-sm",
                  },
                  opt.label,
                ),
              ),
            ),
          ),
        ),
        React.createElement(
          "div",
          {
            className: "mb-10",
          },
          React.createElement(
            "h3",
            {
              className:
                "font-display text-gold-400 text-sm tracking-[0.3em] mb-3",
            },
            t.reserve.hotel_pn.toUpperCase(),
          ),
          React.createElement(
            "p",
            {
              className:
                "font-serif italic text-cream/70 text-base mb-4 leading-relaxed",
            },
            t.reserve.hotel_pn_desc,
          ),
          React.createElement(
            "div",
            {
              className: "space-y-2",
            },
            t.reserve.hotel_pn_opts.map((opt, i) =>
              React.createElement(
                "label",
                {
                  key: i,
                  className: `flex items-center gap-3 py-2 px-1 cursor-pointer border-b border-gold-700/15 last:border-0 transition-colors ${hotelPN === opt.value ? "text-gold-300" : "text-cream/90 hover:text-cream"}`,
                },
                React.createElement("input", {
                  type: "radio",
                  name: "hotelPN",
                  value: opt.value,
                  checked: hotelPN === opt.value,
                  onChange: (e) => setHotelPN(e.target.value),
                  className: "accent-gold-400",
                }),
                React.createElement(
                  "span",
                  {
                    className: "font-sans text-sm",
                  },
                  opt.label,
                ),
              ),
            ),
          ),
        ),
        React.createElement(
          "div",
          {
            className: "mb-10",
          },
          React.createElement(
            "label",
            {
              className: "luxe-label",
            },
            t.reserve.notes,
          ),
          React.createElement("input", {
            type: "text",
            className: "luxe-input",
            placeholder: t.reserve.notes_ph,
            value: notes,
            onChange: (e) => setNotes(e.target.value),
          }),
        ),
        React.createElement(
          "div",
          {
            className: "border-l-2 border-gold-400 bg-forest-700/40 p-5 mb-10",
          },
          React.createElement(
            "div",
            {
              className:
                "font-display text-gold-300 text-[0.7rem] tracking-[0.3em] uppercase mb-3 flex items-center gap-2",
            },
            React.createElement(
              "span",
              {
                className: "text-gold-400",
              },
              "◆",
            ),
            t.reserve.policy_title,
          ),
          React.createElement(
            "ul",
            {
              className: "space-y-2",
            },
            [
              t.reserve.policy_deposit,
              t.reserve.policy_50,
              t.reserve.policy_cancel,
            ].map((info, i) =>
              React.createElement(
                "li",
                {
                  key: i,
                  className: "flex items-start gap-3 text-cream/85",
                },
                React.createElement(
                  "span",
                  {
                    className: "text-gold-400 mt-0.5 text-xs",
                  },
                  "▸",
                ),
                React.createElement(
                  "span",
                  {
                    className: "font-serif italic text-base leading-relaxed",
                  },
                  info,
                ),
              ),
            ),
          ),
        ),
        React.createElement(
          "div",
          {
            className:
              "border-t border-gold-700/30 pt-6 mb-6 flex flex-col items-center gap-6",
          },
          React.createElement(
            "div",
            {
              className: "text-center",
            },
            React.createElement(
              "div",
              {
                className:
                  "font-display text-[0.7rem] tracking-[0.3em] text-gold-400 mb-1",
              },
              t.reserve.total.toUpperCase(),
            ),
            React.createElement(
              "div",
              {
                className: "font-display text-gold-300 text-4xl",
              },
              "$",
              calcTotal().toLocaleString(),
              " ",
              React.createElement(
                "span",
                {
                  className: "text-base text-cream/60",
                },
                "USD",
              ),
            ),
            React.createElement(
              "div",
              {
                className:
                  "mt-3 font-display text-[0.7rem] tracking-[0.25em] text-cream/80",
              },
              t.reserve.deposit_label,
              ": ",
              React.createElement(
                "span",
                {
                  className: "text-gold-300",
                },
                "$",
                calcDeposit().toLocaleString(),
                " USD",
              ),
            ),
            React.createElement(
              "a",
              {
                href: PAYMENT_LINK || "#",
                target: PAYMENT_LINK ? "_blank" : "_self",
                rel: "noopener",
                onClick: (e) => {
                  if (!PAYMENT_LINK) {
                    e.preventDefault();
                    alert(t.reserve.pay_soon);
                  }
                },
                className:
                  "btn-gold mt-4 inline-block !py-2 !px-5 !text-[0.65rem]",
              },
              t.reserve.pay_btn,
            ),
          ),
          React.createElement(
            "div",
            {
              className:
                "border-l-2 border-gold-400 bg-forest-700/40 p-4 mb-4 w-full",
            },
            React.createElement(
              "div",
              {
                className:
                  "font-display text-gold-300 text-[0.7rem] tracking-[0.3em] uppercase mb-1",
              },
              t.hunt.garantia_title,
            ),
            React.createElement(
              "p",
              {
                className:
                  "font-serif italic text-cream/80 text-sm leading-relaxed",
              },
              t.hunt.garantia_desc,
            ),
          ),
          React.createElement(
            "div",
            {
              className: "grid sm:grid-cols-3 gap-3 w-full",
            },
            React.createElement(
              "button",
              {
                onClick: sendWhatsApp,
                className: "btn-gold flex items-center gap-2 justify-center",
              },
              React.createElement(
                "svg",
                {
                  width: "16",
                  height: "16",
                  viewBox: "0 0 24 24",
                  fill: "currentColor",
                },
                React.createElement("path", {
                  d: "M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.2-.7.2-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5-.2 0-.4 0-.6 0-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4 0 1.4 1 2.8 1.2 3 .1.2 2 3.1 4.8 4.4.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.7-.7 1.9-1.3.2-.7.2-1.2.2-1.3-.1-.1-.3-.2-.6-.3z M12 2C6.5 2 2 6.5 2 12c0 1.9.5 3.7 1.5 5.3L2 22l4.8-1.5c1.6.9 3.3 1.5 5.2 1.5 5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18c-1.7 0-3.3-.5-4.7-1.3l-.3-.2-3.5 1.1 1.1-3.4-.2-.3C3.5 14.4 3 13.2 3 12c0-5 4-9 9-9s9 4 9 9-4 9-9 9z",
                }),
              ),
              t.reserve.submit_wa,
            ),
            React.createElement(
              "button",
              {
                onClick: sendSMS,
                className: "btn-gold flex items-center gap-2 justify-center",
              },
              React.createElement(
                "svg",
                {
                  width: "16",
                  height: "16",
                  viewBox: "0 0 24 24",
                  fill: "currentColor",
                },
                React.createElement("path", {
                  d: "M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z",
                }),
              ),
              t.reserve.submit_sms,
            ),
            React.createElement(
              "button",
              {
                onClick: sendEmail,
                className: "btn-gold flex items-center gap-2 justify-center",
              },
              React.createElement(
                "svg",
                {
                  width: "16",
                  height: "16",
                  viewBox: "0 0 24 24",
                  fill: "currentColor",
                },
                React.createElement("path", {
                  d: "M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z",
                }),
              ),
              t.reserve.submit_email,
            ),
          ),
        ),
        React.createElement(
          "div",
          {
            className: "border-t border-gold-700/20 pt-5 text-center",
          },
          React.createElement(
            "p",
            {
              className:
                "font-serif italic text-cream/70 text-sm leading-relaxed max-w-2xl mx-auto",
            },
            React.createElement(
              "span",
              {
                className:
                  "font-display text-[0.6rem] tracking-[0.3em] text-gold-400 uppercase block mb-2",
              },
              "\u25C6 ",
              t.reserve.tips_label,
            ),
            t.reserve.tips_note,
          ),
        ),
      ),
    ),
  );
}
function TiendaSection({ t }) {
  const scrollRef = useRef(null);
  const scroll = (dir) => {
    if (scrollRef.current)
      scrollRef.current.scrollBy({
        left: dir * 320,
        behavior: "smooth",
      });
  };
  return React.createElement(
    "section",
    {
      id: "tienda",
      className:
        "section-bg-hacienda py-32 border-t border-gold-700/20 relative",
    },
    React.createElement(
      "div",
      {
        className: "max-w-7xl mx-auto px-6",
      },
      React.createElement(
        "div",
        {
          className: "text-center mb-12",
        },
        React.createElement("div", {
          className: "ornament",
        }),
        React.createElement(
          "p",
          {
            className:
              "font-display text-[0.7rem] tracking-[0.4em] text-gold-400 mb-3",
          },
          t.tienda.eyebrow.toUpperCase(),
        ),
        React.createElement(
          "h2",
          {
            className: "display-xl text-cream text-4xl md:text-6xl mb-6",
          },
          t.tienda.title,
        ),
        React.createElement(
          "p",
          {
            className:
              "script-accent text-lg md:text-xl text-cream/80 max-w-3xl mx-auto italic leading-relaxed",
          },
          t.tienda.desc,
        ),
      ),
      React.createElement(
        "div",
        {
          className: "flex items-center justify-between mb-6",
        },
        React.createElement(
          "span",
          {
            className:
              "font-display text-[0.6rem] tracking-[0.3em] text-gold-500 uppercase",
          },
          t.tienda.drag_hint,
        ),
        React.createElement(
          "div",
          {
            className: "flex gap-3",
          },
          React.createElement(
            "button",
            {
              onClick: () => scroll(-1),
              className: "carousel-btn",
              "aria-label": "prev",
            },
            React.createElement(
              "svg",
              {
                width: "18",
                height: "18",
                viewBox: "0 0 18 18",
              },
              React.createElement("path", {
                d: "M11 4 L6 9 L11 14",
                stroke: "currentColor",
                fill: "none",
                strokeWidth: "1.6",
              }),
            ),
          ),
          React.createElement(
            "button",
            {
              onClick: () => scroll(1),
              className: "carousel-btn",
              "aria-label": "next",
            },
            React.createElement(
              "svg",
              {
                width: "18",
                height: "18",
                viewBox: "0 0 18 18",
              },
              React.createElement("path", {
                d: "M7 4 L12 9 L7 14",
                stroke: "currentColor",
                fill: "none",
                strokeWidth: "1.6",
              }),
            ),
          ),
        ),
      ),
      React.createElement(
        "div",
        {
          ref: scrollRef,
          className:
            "no-scrollbar flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth",
        },
        t.tienda.products.map((p, i) => {
          const media = PRODUCT_MEDIA[i] || {
            icon: "✦",
            img: "",
          };
          return React.createElement(
            "div",
            {
              key: i,
              className:
                "card-luxe overflow-hidden flex flex-col flex-shrink-0 w-72 snap-start",
            },
            React.createElement(
              "div",
              {
                className: "product-frame h-56",
                style: {
                  backgroundImage: media.img ? `url('${media.img}')` : "none",
                },
              },
              React.createElement(
                "span",
                {
                  className: "product-icon",
                },
                media.icon,
              ),
              p.custom &&
                React.createElement(
                  "span",
                  {
                    className: "absolute top-3 right-3 z-10 product-chip",
                    style: {
                      background: "rgba(157,127,71,0.9)",
                      color: "#faf6ec",
                      borderColor: "#d4b878",
                    },
                  },
                  t.tienda.custom_badge,
                ),
            ),
            React.createElement(
              "div",
              {
                className: "p-5 flex flex-col flex-1",
              },
              React.createElement(
                "div",
                {
                  className:
                    "font-sans text-[0.6rem] tracking-[0.3em] text-gold-400 uppercase mb-1",
                },
                p.tag,
              ),
              React.createElement(
                "h4",
                {
                  className:
                    "font-display text-cream text-lg mb-2 tracking-wider",
                },
                p.name,
              ),
              React.createElement(
                "p",
                {
                  className:
                    "font-serif italic text-cream/75 text-sm leading-relaxed mb-3 flex-1",
                },
                p.desc,
              ),
              p.colors &&
                React.createElement(
                  "div",
                  {
                    className: "mb-2",
                  },
                  React.createElement(
                    "span",
                    {
                      className:
                        "font-display text-[0.55rem] tracking-[0.2em] text-gold-500 uppercase block mb-1",
                    },
                    t.tienda.colors_label,
                  ),
                  React.createElement(
                    "div",
                    {
                      className: "flex flex-wrap gap-1.5",
                    },
                    p.colors.map((c, ci) =>
                      React.createElement(
                        "span",
                        {
                          key: ci,
                          className: "product-chip",
                        },
                        c,
                      ),
                    ),
                  ),
                ),
              p.sizes &&
                React.createElement(
                  "div",
                  {
                    className: "mb-2",
                  },
                  React.createElement(
                    "span",
                    {
                      className:
                        "font-display text-[0.55rem] tracking-[0.2em] text-gold-500 uppercase block mb-1",
                    },
                    t.tienda.sizes_label,
                  ),
                  React.createElement(
                    "div",
                    {
                      className: "flex flex-wrap gap-1.5",
                    },
                    p.sizes.map((s, si) =>
                      React.createElement(
                        "span",
                        {
                          key: si,
                          className: "product-chip",
                        },
                        s,
                      ),
                    ),
                  ),
                ),
              p.custom &&
                React.createElement(
                  "p",
                  {
                    className:
                      "font-sans text-[0.7rem] text-gold-300/80 mb-2 leading-snug",
                  },
                  t.tienda.custom_note,
                ),
              React.createElement(
                "div",
                {
                  className:
                    "mt-auto pt-3 border-t border-gold-700/30 flex items-center justify-between",
                },
                React.createElement(
                  "span",
                  {
                    className: "font-display text-gold-300 text-xl",
                  },
                  p.price,
                ),
                React.createElement(
                  "a",
                  {
                    href: "#reservar",
                    className: "btn-outline !py-1.5 !px-3 !text-[0.55rem]",
                  },
                  t.hunt.booking_cta,
                ),
              ),
            ),
          );
        }),
      ),
      React.createElement(
        "div",
        {
          className:
            "border-l-2 border-gold-400 bg-forest-700/40 p-5 max-w-3xl mx-auto mt-10",
        },
        React.createElement(
          "p",
          {
            className:
              "font-serif italic text-cream/90 text-base leading-relaxed text-center",
          },
          React.createElement(
            "span",
            {
              className:
                "font-display text-gold-300 text-[0.7rem] tracking-[0.3em] uppercase block mb-2",
            },
            "◆ ",
            t.tienda.eyebrow,
          ),
          t.tienda.note,
        ),
      ),
    ),
  );
}
function ContactSection({ t }) {
  return React.createElement(
    "section",
    {
      id: "contacto",
      className: "pt-32 pb-4 bg-forest-800 border-t border-gold-700/20",
    },
    React.createElement(
      "div",
      {
        className: "max-w-5xl mx-auto px-6",
      },
      React.createElement(
        "div",
        {
          className: "text-center mb-12",
        },
        React.createElement("div", {
          className: "ornament",
        }),
        React.createElement(
          "p",
          {
            className:
              "font-display text-[0.7rem] tracking-[0.4em] text-gold-400 mb-3",
          },
          t.contact.eyebrow.toUpperCase(),
        ),
        React.createElement(
          "h2",
          {
            className: "display-xl text-cream text-4xl md:text-6xl mb-6",
          },
          t.contact.title,
        ),
      ),
      React.createElement(
        "div",
        {
          className: "grid md:grid-cols-2 gap-6",
        },
        [
          {
            icon: "images/socialMedia/whatsapp.webp",
            label: t.contact.phone,
            value: "+52 (844) 123-4567",
            href: "https://wa.me/5218441234567",
          },
          {
            icon: "images/socialMedia/email.webp",
            label: t.contact.email,
            value: "Haciendaelcielo@gmail.com",
            href: "mailto:Haciendaelcielo@gmail.com",
          },
          {
            icon: "images/socialMedia/ig.webp",
            label: t.contact.ig,
            value: "@haciendaelcielo.coahuila",
            href: "https://www.instagram.com/haciendaelcielo.coahuila/",
          },
          {
            icon: "images/socialMedia/facebook.webp",
            label: t.contact.fb,
            value: "Hacienda El Cielo",
            href: "https://www.facebook.com/profile.php?id=100063120524468",
          },
        ].map((c, i) =>
          React.createElement(
            "a",
            {
              key: i,
              href: c.href,
              target: "_blank",
              rel: "noopener",
              className: "card-luxe p-6 flex items-center gap-5 group",
            },
            React.createElement(
              "div",
              {
                className: "font-display text-gold-400 text-3xl",
              },
              c.icon.endsWith(".webp") || c.icon.endsWith(".svg")
                ? React.createElement("img", {
                    src: c.icon,
                    alt: c.label,
                    className: "w-8 h-8 object-contain",
                  })
                : c.icon,
            ),
            React.createElement(
              "div",
              null,
              React.createElement(
                "div",
                {
                  className:
                    "font-display text-[0.65rem] tracking-[0.3em] text-gold-400 mb-1",
                },
                c.label.toUpperCase(),
              ),
              React.createElement(
                "div",
                {
                  className:
                    "font-serif text-cream text-lg group-hover:text-gold-300 transition",
                },
                c.value,
              ),
            ),
          ),
        ),
      ),
      React.createElement("div", {
        className: "mt-10 text-center",
      }),
    ),
  );
}
function Footer({ t }) {
  return React.createElement(
    "footer",
    {
      className: "bg-forest-900 py-12 border-t border-gold-700/20",
    },
    React.createElement(
      "div",
      {
        className: "max-w-6xl mx-auto px-6 text-center",
      },
      React.createElement(
        "div",
        {
          className: "flex justify-center items-center gap-3 mb-4",
        },
        React.createElement("img", {
          src: LOGO_SRC,
          alt: "Hacienda El Cielo",
          className: "h-7 w-auto",
        }),
        React.createElement(
          "span",
          {
            className: "font-display text-gold-300 text-sm tracking-[0.3em]",
          },
          "HACIENDA EL CIELO",
        ),
      ),
      React.createElement(
        "p",
        {
          className: "font-serif italic text-cream/70 mb-6 max-w-2xl mx-auto",
        },
        t.footer.tagline,
      ),
      React.createElement(
        "div",
        {
          className: "gold-divider mb-6",
        },
        React.createElement(
          "span",
          {
            className:
              "font-display text-[0.6rem] tracking-[0.3em] text-gold-400",
          },
          "ZARAGOZA \xB7 COAHUILA \xB7 M\xC9XICO",
        ),
      ),
      React.createElement(
        "p",
        {
          className:
            "font-sans text-[0.65rem] tracking-[0.2em] text-cream/40 uppercase",
        },
        "\xA9 2026 Hacienda El Cielo. ",
        t.footer.rights,
      ),
    ),
  );
}
function AdminPanel({ lang, setLang }) {
  const [authed, setAuthed] = useState(false);
  const [pin, setPin] = useState("");
  const [rows, setRows] = useState([]);
  const load = () => {
    try {
      setRows(JSON.parse(localStorage.getItem("hec_reservations") || "[]"));
    } catch (e) {
      setRows([]);
    }
  };
  useEffect(() => {
    load();
  }, []);
  const persist = (list) => {
    localStorage.setItem("hec_reservations", JSON.stringify(list));
    setRows(list);
  };
  const togglePaid = (idx) =>
    persist(
      rows.map((r, i) =>
        i === idx
          ? Object.assign({}, r, {
              paid: !r.paid,
            })
          : r,
      ),
    );
  const del = (idx) => {
    if (window.confirm("¿Eliminar esta reservación?"))
      persist(rows.filter((_, i) => i !== idx));
  };
  const clearAll = () => {
    if (
      window.confirm(
        "¿Borrar TODAS las reservaciones guardadas en este dispositivo?",
      )
    )
      persist([]);
  };
  const exportCSV = () => {
    const head = [
      "Fecha",
      "Cliente",
      "Cazadores",
      "Acompañantes",
      "Paquetes",
      "Hotel",
      "Llegada",
      "Notas",
      "Total USD",
      "Anticipo USD",
      "Estado",
    ];
    const esc = (v) =>
      '"' + String(v == null ? "" : v).replace(/"/g, '""') + '"';
    const lines = [head.map(esc).join(",")];
    rows.forEach((r) => {
      lines.push(
        [
          r.ts,
          r.client,
          (r.hunters || []).map((h) => h.name + " (" + h.age + ")").join(" | "),
          (r.companions || [])
            .map((c) => c.name + " (" + c.age + ")")
            .join(" | "),
          (r.packages || []).join(" | "),
          r.hotel,
          r.arrival_method,
          r.notes,
          r.total,
          r.deposit,
          r.paid ? "Pagado" : "Pendiente",
        ]
          .map(esc)
          .join(","),
      );
    });
    const blob = new Blob(["﻿" + lines.join("\n")], {
      type: "text/csv;charset=utf-8",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "reservaciones-hacienda-el-cielo.csv";
    a.click();
  };
  const goSite = () => {
    window.location.hash = "#inicio";
  };
  if (!authed) {
    return React.createElement(
      "div",
      {
        className:
          "min-h-screen flex items-center justify-center bg-forest-900 px-6",
      },
      React.createElement(
        "div",
        {
          className: "card-luxe p-10 max-w-sm w-full text-center",
        },
        React.createElement("div", {
          className: "ornament",
        }),
        React.createElement(
          "h1",
          {
            className: "display-xl text-cream text-2xl mb-1",
          },
          "Panel de Reservaciones",
        ),
        React.createElement(
          "p",
          {
            className: "font-serif italic text-cream/70 mb-6",
          },
          "Hacienda El Cielo",
        ),
        React.createElement("input", {
          type: "password",
          className: "luxe-input mb-4 text-center",
          placeholder: "PIN",
          value: pin,
          onChange: (e) => setPin(e.target.value),
          onKeyDown: (e) => {
            if (e.key === "Enter") setAuthed(pin === ADMIN_PIN);
          },
        }),
        React.createElement(
          "button",
          {
            onClick: () => setAuthed(pin === ADMIN_PIN),
            className: "btn-gold w-full",
          },
          "Entrar",
        ),
        React.createElement(
          "button",
          {
            onClick: goSite,
            className: "block w-full mt-4 nav-link",
          },
          "← Volver al sitio",
        ),
      ),
    );
  }
  const totalEst = rows.reduce((a, r) => a + (r.total || 0), 0);
  const totalDep = rows.reduce((a, r) => a + (r.deposit || 0), 0);
  const paidCount = rows.filter((r) => r.paid).length;
  const stats = [
    {
      label: "Reservaciones",
      val: rows.length,
    },
    {
      label: "Pagadas",
      val: paidCount,
    },
    {
      label: "Total estimado",
      val: "$" + totalEst.toLocaleString(),
    },
    {
      label: "Total anticipos (20%)",
      val: "$" + totalDep.toLocaleString(),
    },
  ];
  const cols = [
    "#",
    "Fecha",
    "Cliente",
    "Cazadores",
    "Acompañantes",
    "Paquetes",
    "Hotel",
    "Llegada",
    "Notas",
    "Total",
    "Anticipo",
    "Estado",
    "",
  ];
  return React.createElement(
    "div",
    {
      className: "min-h-screen bg-forest-900 text-cream p-4 md:p-8",
    },
    React.createElement(
      "div",
      {
        className: "max-w-7xl mx-auto",
      },
      React.createElement(
        "div",
        {
          className: "flex flex-wrap items-center justify-between gap-4 mb-6",
        },
        React.createElement(
          "div",
          null,
          React.createElement(
            "h1",
            {
              className: "display-xl text-gold-300 text-2xl md:text-3xl",
            },
            "Panel de Reservaciones",
          ),
          React.createElement(
            "p",
            {
              className: "font-serif italic text-cream/60 text-sm",
            },
            "Datos guardados en este dispositivo",
          ),
        ),
        React.createElement(
          "div",
          {
            className: "flex flex-wrap gap-2",
          },
          React.createElement(
            "button",
            {
              onClick: load,
              className: "btn-outline !py-2 !px-4 !text-[0.6rem]",
            },
            "Actualizar",
          ),
          React.createElement(
            "button",
            {
              onClick: exportCSV,
              className: "btn-gold !py-2 !px-4 !text-[0.6rem]",
            },
            "Exportar CSV",
          ),
          React.createElement(
            "button",
            {
              onClick: clearAll,
              className: "btn-outline !py-2 !px-4 !text-[0.6rem]",
            },
            "Borrar todo",
          ),
          React.createElement(
            "button",
            {
              onClick: goSite,
              className: "btn-outline !py-2 !px-4 !text-[0.6rem]",
            },
            "← Sitio",
          ),
        ),
      ),
      React.createElement(
        "div",
        {
          className: "grid grid-cols-2 md:grid-cols-4 gap-3 mb-8",
        },
        stats.map((st, i) =>
          React.createElement(
            "div",
            {
              key: i,
              className: "card-luxe p-4 text-center",
            },
            React.createElement(
              "div",
              {
                className: "font-display text-gold-300 text-2xl",
              },
              st.val,
            ),
            React.createElement(
              "div",
              {
                className:
                  "font-sans text-[0.6rem] tracking-[0.2em] uppercase text-cream/60 mt-1",
              },
              st.label,
            ),
          ),
        ),
      ),
      rows.length === 0
        ? React.createElement(
            "div",
            {
              className:
                "card-luxe p-12 text-center font-serif italic text-cream/60",
            },
            "Aún no hay reservaciones guardadas en este dispositivo. Cuando un cliente envía el formulario desde este navegador, aparece aquí.",
          )
        : React.createElement(
            "div",
            {
              className: "card-luxe overflow-x-auto",
            },
            React.createElement(
              "table",
              {
                className: "w-full text-left border-collapse min-w-[900px]",
              },
              React.createElement(
                "thead",
                null,
                React.createElement(
                  "tr",
                  {
                    className: "border-b border-gold-600/40",
                  },
                  cols.map((c, i) =>
                    React.createElement(
                      "th",
                      {
                        key: i,
                        className:
                          "p-2 font-display text-[0.55rem] tracking-[0.2em] uppercase text-gold-400",
                      },
                      c,
                    ),
                  ),
                ),
              ),
              React.createElement(
                "tbody",
                null,
                rows.map((r, i) =>
                  React.createElement(
                    "tr",
                    {
                      key: i,
                      className: "border-b border-gold-700/20 align-top",
                    },
                    React.createElement(
                      "td",
                      {
                        className: "p-2 text-xs text-cream/50",
                      },
                      i + 1,
                    ),
                    React.createElement(
                      "td",
                      {
                        className:
                          "p-2 text-xs whitespace-nowrap text-cream/70",
                      },
                      r.ts,
                    ),
                    React.createElement(
                      "td",
                      {
                        className:
                          "p-2 text-sm font-display text-gold-300 whitespace-nowrap",
                      },
                      r.client,
                    ),
                    React.createElement(
                      "td",
                      {
                        className: "p-2 text-xs",
                      },
                      (r.hunters || []).map((h, j) =>
                        React.createElement(
                          "div",
                          {
                            key: j,
                          },
                          h.name +
                            " (" +
                            h.age +
                            ")" +
                            (h.packages && h.packages.length
                              ? " — " + h.packages.join(", ")
                              : ""),
                        ),
                      ),
                    ),
                    React.createElement(
                      "td",
                      {
                        className: "p-2 text-xs",
                      },
                      (r.companions || []).length
                        ? (r.companions || []).map((c, j) =>
                            React.createElement(
                              "div",
                              {
                                key: j,
                              },
                              c.name + " (" + c.age + ")",
                            ),
                          )
                        : "—",
                    ),
                    React.createElement(
                      "td",
                      {
                        className: "p-2 text-xs",
                      },
                      (r.packages || []).join(", ") || "—",
                    ),
                    React.createElement(
                      "td",
                      {
                        className: "p-2 text-xs",
                      },
                      r.hotel || "—",
                    ),
                    React.createElement(
                      "td",
                      {
                        className: "p-2 text-xs",
                      },
                      r.arrival_method || "—",
                    ),
                    React.createElement(
                      "td",
                      {
                        className: "p-2 text-xs max-w-[180px] text-cream/70",
                      },
                      r.notes || "—",
                    ),
                    React.createElement(
                      "td",
                      {
                        className:
                          "p-2 text-xs whitespace-nowrap text-gold-300",
                      },
                      "$" + (r.total || 0).toLocaleString(),
                    ),
                    React.createElement(
                      "td",
                      {
                        className: "p-2 text-xs whitespace-nowrap",
                      },
                      "$" + (r.deposit || 0).toLocaleString(),
                    ),
                    React.createElement(
                      "td",
                      {
                        className: "p-2",
                      },
                      React.createElement(
                        "button",
                        {
                          onClick: () => togglePaid(i),
                          className: r.paid
                            ? "px-2 py-1 text-[0.55rem] tracking-wider bg-green-800/50 border border-green-500 text-green-200 rounded"
                            : "px-2 py-1 text-[0.55rem] tracking-wider bg-gold-700/30 border border-gold-600 text-gold-200 rounded",
                        },
                        r.paid ? "Pagado ✓" : "Pendiente",
                      ),
                    ),
                    React.createElement(
                      "td",
                      {
                        className: "p-2",
                      },
                      React.createElement(
                        "button",
                        {
                          onClick: () => del(i),
                          className: "text-red-300 hover:text-red-200 text-xs",
                        },
                        "✕",
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
    ),
  );
}
function PedigreeSection({ t, lang }) {
  const [sel, setSel] = useState(null);
  const L = PEDIGREE_T[lang];
  const b = sel != null ? PEDIGREE[sel] : null;
  const node = (label, name, main) =>
    React.createElement(
      "div",
      {
        className: main ? "ped-node ped-node-main" : "ped-node",
      },
      label
        ? React.createElement(
            "div",
            {
              className:
                "font-display text-[0.5rem] tracking-[0.2em] uppercase text-gold-500 mb-1",
            },
            label,
          )
        : null,
      React.createElement(
        "div",
        {
          className: main
            ? "font-display text-gold-200 text-base tracking-wider"
            : "font-serif text-cream text-sm",
        },
        name,
      ),
    );
  return React.createElement(
    "section",
    {
      id: "caceria-pedigri",
      className: "py-32 border-t border-gold-700/20",
    },
    React.createElement(
      "div",
      {
        className: "max-w-7xl mx-auto px-6",
      },
      React.createElement(
        "div",
        {
          className: "text-center mb-16",
        },
        React.createElement("div", {
          className: "ornament",
        }),
        React.createElement(
          "p",
          {
            className:
              "font-display text-[0.7rem] tracking-[0.4em] text-gold-400 mb-3",
          },
          L.eyebrow.toUpperCase(),
        ),
        React.createElement(
          "h2",
          {
            className: "display-xl text-cream text-4xl md:text-6xl mb-6",
          },
          L.title,
        ),
        React.createElement(
          "p",
          {
            className:
              "script-accent text-lg md:text-xl text-cream/80 max-w-3xl mx-auto italic leading-relaxed",
          },
          L.desc,
        ),
      ),
      /*VIDEOS HOVER IMAGENES VENADOS*/
      React.createElement(
        "div",
        {
          className: "grid grid-cols-2 md:grid-cols-3 gap-6",
        },
        PEDIGREE.map((bk, i) =>
          React.createElement(
            "button",
            {
              key: i,
              onClick: () => setSel(i),
              className: "card-luxe overflow-hidden block w-full text-left",
            },
            React.createElement(
              "div",
              {
                className: "ped-frame h-60 md:h-64 relative overflow-hidden",
                onMouseEnter: (e) => {
                  const video = e.currentTarget.querySelector("video");
                  video.style.opacity = 1;
                  video.play();
                },
                onMouseLeave: (e) => {
                  const video = e.currentTarget.querySelector("video");
                  video.pause();
                  video.currentTime = 0;
                  video.style.opacity = 0;
                },
              },

              // Imagen
              React.createElement("img", {
                src: bk.photo,
                alt: bk.name,
                className: "absolute inset-0 w-full h-full object-cover",
              }),

              // Video
              React.createElement(
                "video",
                {
                  className:
                    "absolute inset-0 w-full h-full object-cover transition-opacity duration-300 opacity-0",
                  muted: true,
                  loop: true,
                  playsInline: true,
                },
                React.createElement("source", {
                  src: bk.video,
                  type: "video/mp4",
                }),
              ),
            ),
            /*React.createElement(
              "div",
              {
                className: "ped-frame h-60 md:h-64",
              },
              React.createElement("img", {
                src: bk.photo,
                alt: bk.name,
              }),
            ),*/
            React.createElement(
              "div",
              {
                className: "p-5",
              },
              React.createElement(
                "h3",
                {
                  className:
                    "font-display text-cream text-xl tracking-wider mb-1",
                },
                bk.name,
              ),
              React.createElement("p", {
                className:
                  "font-sans text-[0.65rem] tracking-[0.2em] uppercase text-gold-400 mb-2",
              }),
              React.createElement(
                "span",
                {
                  className:
                    "font-display text-[0.6rem] tracking-[0.25em] uppercase text-gold-300",
                },
                L.more,
              ),
            ),
          ),
        ),
      ),
      /*FIN VIDEOS HOVER IMAGENES VENADOS*/
      b &&
        React.createElement(
          "div",
          {
            className: "ped-modal-overlay",
            onClick: () => setSel(null),
          },
          React.createElement(
            "div",
            {
              className: "ped-modal",
              onClick: (e) => e.stopPropagation(),
            },
            React.createElement(
              "button",
              {
                className: "ped-close",
                onClick: () => setSel(null),
                "aria-label": "Close",
              },
              "\u00d7",
            ),
            React.createElement(
              "div",
              {
                className: "ped-frame h-64 md:h-72",
              },
              React.createElement("img", {
                src: b.photo,
                alt: b.name,
              }),
            ),
            React.createElement(
              "div",
              {
                className: "p-6 md:p-8",
              },
              React.createElement(
                "h3",
                {
                  className: "display-xl text-cream text-3xl md:text-4xl mb-1",
                },
                b.name,
              ),
              React.createElement("p", {
                className:
                  "font-sans text-[0.7rem] tracking-[0.3em] uppercase text-gold-400 mb-4",
              }),
              React.createElement(
                "p",
                {
                  className:
                    "font-serif italic text-cream/85 text-base md:text-lg leading-relaxed mb-6",
                },
                b.desc[lang],
              ),
              React.createElement(
                "div",
                {
                  className: "pt-6 border-t border-gold-700/30",
                },
                React.createElement(
                  "div",
                  {
                    className:
                      "font-display text-gold-400 text-[0.65rem] tracking-[0.3em] uppercase mb-5 text-center",
                  },
                  L.tree,
                ),
                React.createElement(
                  "div",
                  {
                    className: "grid grid-cols-2 gap-5 max-w-xl mx-auto",
                  },
                  React.createElement(
                    "div",
                    {
                      className: "text-center",
                    },
                    React.createElement(
                      "div",
                      {
                        className: "grid grid-cols-2 gap-2",
                      },
                      node(L.gp, b.gp),
                      node(L.gpd, b.gpd),
                    ),
                    React.createElement("div", {
                      className: "ped-line",
                    }),
                    node(L.sire, b.sire),
                  ),
                  React.createElement(
                    "div",
                    {
                      className: "text-center",
                    },
                    React.createElement(
                      "div",
                      {
                        className: "grid grid-cols-2 gap-2",
                      },
                      node(L.gm, b.gm),
                      node(L.gmd, b.gmd),
                    ),
                    React.createElement("div", {
                      className: "ped-line",
                    }),
                    node(L.dam, b.dam),
                  ),
                ),
                React.createElement("div", {
                  className: "ped-line-center",
                }),
                React.createElement(
                  "div",
                  {
                    className: "max-w-[60%] mx-auto",
                  },
                  node("", b.name, true),
                ),
              ),
              React.createElement(
                "p",
                {
                  className:
                    "font-serif italic text-cream/75 text-sm leading-relaxed mt-6 mb-4 text-center",
                },
                L.buy,
              ),
              React.createElement(
                "a",
                {
                  href:
                    "https://wa.me/18307572121?text=" +
                    encodeURIComponent(L.wa + b.name),
                  target: "_blank",
                  rel: "noopener",
                  className:
                    "btn-gold w-full inline-flex items-center justify-center gap-2",
                },
                React.createElement(
                  "svg",
                  {
                    width: "18",
                    height: "18",
                    viewBox: "0 0 24 24",
                    fill: "currentColor",
                  },
                  React.createElement("path", {
                    d: "M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.2-.7.2-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5-.2 0-.4 0-.6 0-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4 0 1.4 1 2.8 1.2 3 .1.2 2 3.1 4.8 4.4.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.7-.7 1.9-1.3.2-.7.2-1.2.2-1.3-.1-.1-.3-.2-.6-.3z M12 2C6.5 2 2 6.5 2 12c0 1.9.5 3.7 1.5 5.3L2 22l4.8-1.5c1.6.9 3.3 1.5 5.2 1.5 5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18c-1.7 0-3.3-.5-4.7-1.3l-.3-.2-3.5 1.1 1.1-3.4-.2-.3C3.5 14.4 3 13.2 3 12c0-5 4-9 9-9s9 4 9 9-4 9-9 9z",
                  }),
                ),
                L.contact,
              ),
            ),
          ),
        ),
    ),
  );
}
function FloatingCTA({ t }) {
  return React.createElement(
    "div",
    {
      className: "floating-cta",
    },
    React.createElement(
      "a",
      {
        href: "https://wa.me/18307572121",
        target: "_blank",
        rel: "noopener",
        "aria-label": "WhatsApp",
        className: "float-btn float-wa",
      },
      React.createElement(
        "svg",
        {
          width: "26",
          height: "26",
          viewBox: "0 0 24 24",
          fill: "currentColor",
        },
        React.createElement("path", {
          d: "M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.2-.7.2-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5-.2 0-.4 0-.6 0-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4 0 1.4 1 2.8 1.2 3 .1.2 2 3.1 4.8 4.4.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.7-.7 1.9-1.3.2-.7.2-1.2.2-1.3-.1-.1-.3-.2-.6-.3z M12 2C6.5 2 2 6.5 2 12c0 1.9.5 3.7 1.5 5.3L2 22l4.8-1.5c1.6.9 3.3 1.5 5.2 1.5 5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18c-1.7 0-3.3-.5-4.7-1.3l-.3-.2-3.5 1.1 1.1-3.4-.2-.3C3.5 14.4 3 13.2 3 12c0-5 4-9 9-9s9 4 9 9-4 9-9 9z",
        }),
      ),
    ),
  );
}
function TrustBar({ lang }) {
  const items =
    lang === "es"
      ? [
          "7 años · frontera más segura",
          "Hospedaje Hilton · Hyatt",
          "Traslados incluidos",
          "Guía especializado",
        ]
      : [
          "7 years · safest border",
          "Hilton · Hyatt lodging",
          "Transfers included",
          "Specialized guide",
        ];
  return React.createElement(
    "div",
    {
      className: "trust-bar",
    },
    React.createElement(
      "div",
      {
        className:
          "max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-2",
      },
      items.map((it, i) =>
        React.createElement(
          "span",
          {
            key: i,
            className:
              "flex items-center gap-2 font-display text-[0.6rem] md:text-[0.68rem] tracking-[0.2em] uppercase text-cream/70",
          },
          React.createElement(
            "span",
            {
              className: "text-gold-400",
            },
            "\u2605",
          ),
          it,
        ),
      ),
    ),
  );
}
function App() {
  const [lang, setLang] = useState("es");
  const [route, setRoute] = useState(
    typeof window !== "undefined" ? window.location.hash : "",
  );
  useEffect(() => {
    const onH = () => setRoute(window.location.hash);
    window.addEventListener("hashchange", onH);
    return () => window.removeEventListener("hashchange", onH);
  }, []);
  useEffect(() => {
    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          const el = e.target;
          el.classList.add("in-view");
          if (el.classList.contains("stat-num")) countUp(el);
          io.unobserve(el);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );
    function countUp(el) {
      const txt = el.textContent;
      const m = txt.match(/[\d.,]+/);
      if (!m) return;
      const numStr = m[0];
      const target = parseFloat(numStr.replace(/,/g, ""));
      if (!isFinite(target)) return;
      const pre = txt.slice(0, m.index);
      const post = txt.slice(m.index + numStr.length);
      let startT = 0;
      function frame(ts) {
        if (!startT) startT = ts;
        const prog = Math.min((ts - startT) / 1400, 1);
        el.textContent = pre + Math.round(prog * target) + post;
        if (prog < 1) requestAnimationFrame(frame);
        else el.textContent = txt;
      }
      requestAnimationFrame(frame);
    }
    function scan() {
      document
        .querySelectorAll(
          ".card-luxe, .photo-frame, .route-card, .hotel-card, .stat-num",
        )
        .forEach(function (el) {
          if (!el.dataset.io) {
            el.dataset.io = "1";
            io.observe(el);
          }
        });
    }
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });
    function onClick(ev) {
      const fr = ev.target.closest ? ev.target.closest(".photo-frame") : null;
      if (!fr) return;
      const img = fr.querySelector("img");
      if (!img) return;
      const ov = document.createElement("div");
      ov.className = "lightbox-overlay";
      const big = document.createElement("img");
      big.src = img.src;
      ov.appendChild(big);
      ov.addEventListener("click", function () {
        ov.remove();
      });
      document.body.appendChild(ov);
    }
    document.addEventListener("click", onClick);
    return function () {
      io.disconnect();
      mo.disconnect();
      document.removeEventListener("click", onClick);
    };
  }, []);
  const t = T[lang];
  if (route.indexOf("panel") !== -1)
    return React.createElement(AdminPanel, {
      lang: lang,
      setLang: setLang,
    });
  return React.createElement(
    React.Fragment,
    null,
    React.createElement(Navbar, {
      lang: lang,
      setLang: setLang,
      t: t,
    }),
    React.createElement(Hero, {
      t: t,
    }),
    React.createElement(TrustBar, {
      lang: lang,
    }),
    React.createElement(SafetySection, {
      t: t,
    }),
    React.createElement(NatureSection, {
      t: t,
    }),
    React.createElement(HuntSection, {
      t: t,
      lang: lang,
    }),
    React.createElement(PedigreeSection, {
      t: t,
      lang: lang,
    }),
    React.createElement(HaciendaSection, {
      t: t,
    }),
    React.createElement(AboutSection, {
      t: t,
    }),
    React.createElement(HowToArriveSection, {
      t: t,
    }),
    React.createElement(ReservationSection, {
      t: t,
      lang: lang,
    }),
    React.createElement(ContactSection, {
      t: t,
    }),
    React.createElement(Footer, {
      t: t,
    }),
    React.createElement(FloatingCTA, {
      t: t,
    }),
  );
}
ReactDOM.createRoot(document.getElementById("app")).render(
  React.createElement(App, null),
);
