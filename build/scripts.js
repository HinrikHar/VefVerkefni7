/**
 * Verkefnalýsing fyrir verkefni 7 með mörgum athugasemdum, sjá einnig yfirferð í fyrirlestri 9.
 * Sjá `scripts-plain.js` fyrir lausn án athugasemda.
 * Föll og breytur eru skjalaðar með jsdoc, athugasemdir á þessu:
 * // formi eru til nánari útskýringa.
 * eru aukalega og ekki nauðsynlegar.
 * Kóðabútar eru innan ``.
 *
 * @see https://jsdoc.app/
 */

// Til að byrja með skilgreinum við gögn sem við notum í forritinu okkar. Við þurfum að skilgreina
// - Vörur sem er hægt að kaupa
// - Körfu sem geymir vörur sem notandi vill kaupa
// Í báðum tilfellum notum við gagnaskipan (e. data structure) með því að nota hluti (objects),
// fylki (array) og grunn gildi (e. primitive values) eins og tölur (numbers) og strengi (string).

// Hér notum við _typedef_ til að skilgreina hvernig Product hluturinn okkar lítur út.
// Þetta er ekki JavaScript heldur sérstök skilgreining frá JSDoc sem VSCode notar til að hjálpa
// okkur við að skrifa með því að birta intellisense/autocomplete og hugsanlega sýna villur.
// Við getum látið VSCode sýna okkur villur:
// - Opna „Settings“ með Cmd + , (macOS) eða Ctrl + , (Windows) og slá „check js“ í leitargluggann.
// - Velja „JavaScript › Implicit Project Config: Check JS“ og haka í.
// https://code.visualstudio.com/docs/nodejs/working-with-javascript#_type-checking-javascript

/**
 * @typedef {Object} Product
 * @property {number} id Auðkenni vöru, jákvæð heiltala stærri en 0.
 * @property {string} title Titill vöru, ekki tómur strengur.
 * @property {string} description Lýsing á vöru, ekki tómur strengur.
 * @property {number} price Verð á vöru, jákvæð heiltala stærri en 0.
 */

// Við viljum geta haft fleiri en eina vöru þannig að við þurfum að hafa fylki af vörum.
// Við byrjum með fylki sem hefur færslur en gætum síðan í forritinu okkar bætt við vörum.

/**
 * Fylki af vörum sem hægt er að kaupa.
 * @type {Array<Product>}
 */
const products = [
  // Fyrsta stak í fylkinu, verður aðgengilegt sem `products[0]`
  {
    // Auðkennið er eitthvað sem við bara búum til sjálf, verður að vera einkvæmt en engin regla í
    // JavaScript passar upp á það.
    // Þar sem það er aðeins ein tegund af tölum í JavaScript þá verðum við að passa okkur hér að
    // nota heiltölu, ekkert sem bannar okkur að setja `1.1`.
    // Ef við kveikjum á að VSCode sýni villur og við breytum þessu í t.d. streng munum við sjá
    // villu með rauðum undirlínum og færslu í `Problems` glugganum.
    id: 1,

    // Titill er strengur, en gæti verið „tómi strengurinn“ (e. empty string) sem er bara `''`.
    // JavaScript gerir ekki greinarmun á tómum streng og strengjum sem innihalda eitthvað.
    // Við gætum líka notað `""` eða ` `` ` (backticks) til að skilgreina strengi en venjan er að
    // nota einfaldar gæsalappir/úrfellingarkommur (e. single quotes).
    title: 'HTML húfa',

    // Hér skilgreinum við streng í nýrri línu á eftir skilgreiningu á lykli (key) í hlutnum.
    description:
      'Húfa sem heldur hausnum heitum og hvíslar hugsanlega að þér hvaða element væri best að nota.',

    // Verð sem jákvæð heiltala. Getum líka notað `1000` en það er hægt að nota undirstrik (_) til
    // að gera stórar tölur læsilegri, t.d. `100_000_000`.
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Lexical_grammar#numeric_separators
    price: 5_000,
  },
  {
    id: 2,
    title: 'CSS sokkar',
    description: 'Sokkar sem skalast vel með hvaða fótum sem er.',
    price: 3_000,
  },
  {
    id: 3,
    title: 'JavaScript jakki',
    description: 'Mjög töff jakki fyrir öll sem skrifa JavaScript reglulega.',
    price: 20_000,
  },
  // Hér gætum við bætt við fleiri vörum í byrjun.
];

// Skilgreinum hluti sem halda utan um það sem notandi ætlar að kaupa.

/**
 * @typedef {Object} CartLine
 * @property {Product} product Vara í körfu.
 * @property {number} quantity Fjöldi af vöru.
 */

/**
 * @typedef {Object} Cart
 * @property {Array<CartLine>} lines Fylki af línum í körfu.
 * @property {string|null} name Nafn á kaupanda ef skilgreint, annars `null`.
 * @property {string|null} address Heimilisfang kaupanda ef skilgreint, annars `null`.
 */

// Við notum `null` sem gildi fyrir `name` og `address` áður en notandi hefur skilgreint þau.

/**
 * Karfa sem geymir vörur sem notandi vill kaupa.
 * @type {Cart}
 */
const cart = {
  lines: [],
  name: null,
  address: null,
};

// Nú höfum við skilgreint gögnin sem forritið okkar notar. Næst skilgreinum við föll sem vinna með
// gögnin og inntak frá notanda.
// Athugið að hér erum við að setja öll föll í sömu skrá og sama scope, það myndi hjálpa okkur að
// setja föll í mismunandi skrár og nota módúla til að tengja saman, við gerum það í verkefni 8.

// --------------------------------------------------------
// Hjálparföll

/**
 * Sníða (e. format) verð fyrir íslenskar krónur með því að nota `Intl` vefstaðalinn.
 * Athugið að Chrome styður ekki íslensku og mun því ekki birta verð formuð að íslenskum reglum.
 * @example
 * const price = formatPrice(123000);
 * console.log(price); // Skrifar út `123.000 kr.`
 * @param {number} price Verð til að sníða.
 * @returns Verð sniðið með íslenskum krónu.
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl
 */
function formatPrice(price) {
  return new Intl.NumberFormat('is-IS', {
    style: 'currency',
    currency: 'ISK'
  }).format(price);
}

/**
 * Athuga hvort `num` sé heiltala á bilinu `[min, max]`.
 * @param {number} num Tala til að athuga.
 * @param {number} min Lágmarksgildi tölu (að henni meðtaldri), sjálfgefið `0`.
 * @param {number} max Hámarksgildi tölu (að henni meðtaldri), sjálfgefið `Infinity`.
 * @returns `true` ef `num` er heiltala á bilinu `[min, max]`, annars `false`.
 */
function validateInteger(num, min = 0, max = Infinity) {
  return Number.isInteger(num) && num >= min && num <= max;
}

/**
 * Sníða upplýsingar um vöru og hugsanlega fjölda af henni til að birta notanda.
 * @example
 * ```text
 * HTML húfa — 5.000 kr.
 * CSS sokkar — 2x3.000 kr. samtals 6.000 kr.
 * ```
 * @param {Product} product Vara til að birta
 * @param {number | undefined} quantity Fjöldi af vöru, `undefined` ef ekki notað.
 * @returns Streng sem inniheldur upplýsingar um vöru og hugsanlega fjölda af henni.
 */
function formatProduct(product, quantity = undefined) {
  const price = formatPrice(product.price);
  if (quantity !== undefined) {
    const total = formatPrice(product.price * quantity);
    return `${quantity} x ${price} kr. samtals ${total} kr.`;
  }
  return price;
}
function showProducts() {
  for (const product of products) {
    console.log(`#${product.id} ${product.title} — ${product.description} — ${formatPrice(product.price)} kr.`);
  }
}


/**
 * Skila streng sem inniheldur upplýsingar um körfu.
 * @example
 * ```text
 * HTML húfa — 5.000 kr.
 * CSS sokkar — 2x3.000 kr. samtals 6.000 kr.
 * Samtals: 11.000 kr.
 * ```
 * @param {Cart} cart Karfa til að fá upplýsingar um.
 * @returns Streng sem inniheldur upplýsingar um körfu.
 */
function cartInfo(cart) {
  let cartItems = '';
  let totalPrice = 0;

  for (const line of cart.lines) {
    const product = line.product;
    const quantity = line.quantity;
    const lineTotal = product.price * quantity;
    totalPrice += lineTotal;
    cartItems += formatProduct(product, quantity) + '\n';
  }

  const formattedTotalPrice = formatPrice(totalPrice);
  const cartInfoString = cartItems + `Samtals: ${formattedTotalPrice}`;

  return cartInfoString;
}


// --------------------------------------------------------
// Föll fyrir forritið

/**
 * Bætir vöru við `products` fylkið með því að biðja um upplýsingar frá notanda um:
 * - Titil, verður að vera ekki tómur strengur.
 * - Lýsingu, verður að vera ekki tómur strengur.
 * - Verð, verður að vera jákvæð heiltala stærri en 0.
 * Ef eitthvað er ekki löglegt eru birt villuskilaboð í console og hætt er í fallinu.
 * Annars er ný vara búin til og upplýsingar um hana birtar í console.
 * @returns undefined
 */
function addProduct() {
  // Til einföldunar gerum við ekki greinarmun á „Cancel“ og „Escape“ og tómum gildum frá notanda.

  // Förum í gegnum hvort og eitt gildi sem við viljum og pössum að við höfum eitthvað gildi.
  // Gildi sem við fáum í gegnum `prompt` eru annaðhvort `null` ef notandi ýtir á „Cancel“ eða „Esc“
  // eða strengur.
  // Ef við fáum ógilt gildi hættum við í fallinu með því að nota `return` sem skilar `undefined`.
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/return
  // Þetta er kallað „early exit“ og er gott til að koma í veg fyrir að þurfa að skrifa auka
  // skilyrði í if-setningum en getur valdið vandræðum í einhverjum tilfellum.
  // https://en.wikipedia.org/wiki/Structured_programming#Early_exit
    const title = prompt('Titill:');
    if (!title) {
      console.error('Titill má ekki vera tómur.');
      return;
    }
  
    const description = prompt('Lýsing:');
    if (!description) {
      console.error('Lýsing má ekki vera tóm.');
      return;
    }
  
    const priceAsString = prompt('Verð:');
    if (!priceAsString) {
      console.error('Verð má ekki vera tómt.');
      return;
    }
  
    const price = Number.parseInt(priceAsString, 10);
  
    if (!validateInteger(price, 1)) {
      console.error('Verð verður að vera jákvæð heiltala.');
      return;
    }
  
    const id = products.length + 1;
  
    const product = {
      id,
      title,
      description,
      price,
    };
  
    products.push(product);
    console.info(`Vöru bætt við:\n${product.title} — ${product.description} — ${formatPrice(product.price)} kr.`);
  }
  
  
  

/**
 * Bæta vöru við körfu.
 * Byrjar á að biðja um auðkenni vöru sem notandi vill bæta við körfu.
 * Ef auðkenni er ekki heiltala, eru birt villa í console með skilaboðunum:
 * „Auðkenni vöru er ekki löglegt, verður að vera heiltala stærri en 0.“
 * Ef vara finnst ekki með gefnu auðkenni, eru birt villa í console með skilaboðunum:
 * „Vara fannst ekki.“
 * Því næst er beðið um fjölda af vöru sem notandi vill bæta við körfu. Ef fjöldi er ekki heiltala
 * á bilinu `[1, 100>`, eru birtar villuskilaboð í console með skilaboðunum:
 * „Fjöldi er ekki löglegur, lágmark 1 og hámark 99.“
 * Ef vara og fjöldi eru lögleg gildi er vöru bætt við körfu. Ef vara er nú þegar í körfu er fjöldi
 * uppfærður, annars er nýrri línu bætt við körfu.
 *
 * @returns undefined
 */
function addProductToCart() {
  const productIdStr = prompt('Auðkenni vöru sem þú vilt bæta við körfu:');
  const productId = Number.parseInt(productIdStr, 10);

  if (!validateInteger(productId, 1)) {
    console.error('Auðkenni vöru er ekki löglegt, verður að vera heiltala stærri en 0.');
    return;
  }

  const product = products.find((p) => p.id === productId);
  if (!product) {
    console.error('Vara fannst ekki.');
    return;
  }

  const quantityStr = prompt('Fjöldi af vörum sem þú vilt bæta við körfu:');
  const quantity = Number.parseInt(quantityStr, 10);

  if (!validateInteger(quantity, 1, 99)) {
    console.error('Fjöldi er ekki löglegur, lágmark 1 og hámark 99.');
    return;
  }

  const existingLine = cart.lines.find((line) => line.product.id === productId);
  if (existingLine) {
    existingLine.quantity += quantity;
    console.info(`Vöru fjöldi Uppfærður:\n${formatProduct(product, existingLine.quantity)}`);
  } else {
    cart.lines.push({ product, quantity });
    console.info(`Vöru bætt við körfu:\n${formatProduct(product, quantity)}`);
  }
}











  /* Hér ætti að nota `validateInteger` hjálparfall til að staðfesta gögn frá notanda */
  
  /* Til að athuga hvort vara sé til í `cart` þarf að nota `cart.lines.find` */


/**
 * Birta upplýsingar um körfu í console. Ef ekkert er í körfu er „Karfan er tóm.“ birt, annars
 * birtum við upplýsingar um vörur í körfu og heildarverð.
 *
 * @example
 * ```text
 * HTML húfa — 5.000 kr.
 * CSS sokkar — 2x3.000 kr. samtals 6.000 kr.
 * Samtals: 11.000 kr.
 * ```
 * @returns undefined
 */
function showCart() {
  const cartInfoLines = cart.lines.map((line) => formatProduct(line.product, line.quantity));
  const total = cart.lines.reduce((acc, line) => acc + line.product.price * line.quantity, 0);

  if (cartInfoLines.length > 0) {
    for (const line of cartInfoLines) {
      console.log(line);
    }
    console.log(`Samtals: ${formatPrice(total)}`);
  } else {
    console.log('Karfan er tóm.');
  }
}


/**
 * Klárar kaup og birtir kvittun í console.
 * Ef ekkert er í körfu eru birt skilboð í console:
 * „Karfan er tóm.“
 * Annars er notandi beðinn um nafn og heimilisfang, ef annaðhvort er tómt eru birt villuskilaboð í
 * console og hætt í falli.
 * Ef allt er í lagi er kvittun birt í console með upplýsingum um pöntun og heildarverð.
 * @example
 * ```text
 * Pöntun móttekin <nafn>.
 * Vörur verða sendar á <heimilisfang>.
 *
 * HTML húfa — 5.000 kr.
 * CSS sokkar — 2x3.000 kr. samtals 6.000 kr.
 * Samtals: 11.000 kr.
 * ```
 * @returns undefined
 */
function checkout() {
  if (cart.lines.length === 0) {
    console.log('Karfan er tóm.');
  } else {
    const name = prompt('Nafn:');
    const address = prompt('Heimilisfang:');
    
    if (!name || !address) {
      console.error('Nafn og heimilisfang má ekki vera tóm.');
      return;
    }

    console.log(`Pöntun móttekin ${name}.`);
    console.log(`Vörur verða sendar á ${address}.`);
    
    console.log(cartInfo(cart));
  }
}