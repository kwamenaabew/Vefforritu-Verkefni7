/**
 * @typedef {Object} Product
 * @property {number} id Auðkenni vöru, jákvæð heiltala stærri en 0.
 * @property {string} title Titill vöru, ekki tómur strengur.
 * @property {string} description Lýsing á vöru, ekki tómur strengur.
 * @property {number} price Verð á vöru, jákvæð heiltala stærri en 0.
 */

/**
 * Fylki af vörum sem hægt er að kaupa.
 * @type {Array<Product>}
 */
const products = [
  {
    id: 1,
    title: 'HTML húfa',
    description:
      'Húfa sem heldur hausnum heitum og hvíslar hugsanlega að þér hvaða element væri best að nota.',
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
];

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

/**
 * Karfa sem geymir vörur sem notandi vill kaupa.
 * @type {Cart}
 */
const cart = {
  lines: [],
  name: null,
  address: null,
};

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
  const formatter = new Intl.NumberFormat('is-IS', {
    style: 'currency',
    currency: 'ISK',
  });

 
  return formatter.format(price);
}

/**
 * Athuga hvort `num` sé heiltala á bilinu `[min, max]`.
 * @param {number} num Tala til að athuga.
 * @param {number} min Lágmarksgildi tölu (að henni meðtaldri), sjálfgefið `0`.
 * @param {number} max Hámarksgildi tölu (að henni meðtaldri), sjálfgefið `Infinity`.
 * @returns `true` ef `num` er heiltala á bilinu `[min, max]`, annars `false`.
 */
function validateInteger(num, min = 0, max = Infinity) {
    
  if (Number.isInteger(num)) {
      
      
    if (num >= min && num <= max) {
      return true;
    }
  }
  
 
  return false;
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
  const formattedPrice = formatPrice(product.price);
    
    
  if (quantity !== undefined) {
    const totalPrice = formatPrice(product.price * quantity);
    return `${product.title} — ${quantity}x${formattedPrice} total ${totalPrice}`;
  }
  
  
  return `${product.title} — ${formattedPrice}`;
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
  
  if (cart.lines.length === 0) {
    return 'The cart is empty.';
  }
  
  
  let totalPrice = 0;
  
 
  const lines = [];
  
  
  for (const line of cart.lines) {
   
    const lineTotal = line.product.price * line.quantity;
    totalPrice += lineTotal;
    
   
    const formattedLine = formatProduct(line.product, line.quantity);
    lines.push(formattedLine);
  }
  
  
  const formattedTotalPrice = formatPrice(totalPrice);
  
  
  return `${lines.join('\n')}\nTotal: ${formattedTotalPrice}`;
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

  /** @type {Product} */
  const product = {
    id,
    title,
    description,
    price,
  };

  products.push(product);

  console.info(`Vöru bætt við:\n${formatProduct(product)}`);
}

/**
 * Birta lista af vörum í console.
 * @example
 * ```text
 * #1 HTML húfa — Húfa sem heldur hausnum heitum og hvíslar hugsanlega að þér hvaða element væri best að nota. — 5.000 kr.
 * ```
 * @returns undefined
 */
function showProducts() {
      
  for (let i = 0; i < products.length; i++) {
      
    const product = products[i];

   
    const formattedPrice = formatPrice(product.price);

   
    console.log(`#${product.id} ${product.title} — ${product.description} — ${formattedPrice}`);
  }
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

  const productId = prompt('Enter the product ID you want to add to the cart:');
  
   
  if (!validateInteger(Number(productId), 1)) {
    console.error('Product ID must be a positive integer greater than 0.');
    return;
  }

  
  const product = products.find(p => p.id === Number(productId));

  
  if (!product) {
    console.error('Product not found.');
    return;
  }

  
  const quantity = prompt('Enter the quantity you want to add:');

  
  if (!validateInteger(Number(quantity), 1, 99)) {
    console.error('Quantity must be an integer between 1 and 99.');
    return;
  }

  
  const cartLine = cart.lines.find(line => line.product.id === product.id);

  
  if (cartLine) {
    cartLine.quantity += Number(quantity);
    console.info(`Updated quantity of ${product.title} to ${cartLine.quantity}`);
  } else {
    
    const newCartLine = {
      product,
      quantity: Number(quantity),
    };
    cart.lines.push(newCartLine);
    console.info(`Added ${product.title} to the cart.`);
  }
  
}

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
  if (cart.lines.length === 0) {
    console.log("The cart is empty.");
    return;
  }

 
  let totalPrice = 0;

  
  for (const line of cart.lines) {
    
    const { product, quantity } = line;


    const lineTotal = product.price * quantity;

    
    totalPrice += lineTotal;

 
    console.log(`${product.title} — ${quantity}x${formatPrice(product.price)} total: ${formatPrice(lineTotal)}`);
  }

 
  console.log(`Total: ${formatPrice(totalPrice)}`);
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
    console.log("Karfan er tóm.");
    return;
  }

  
  const name = prompt("Nafn:");
  const address = prompt("Heimilisfang:");

  
  if (!name || !address) {
    console.error("Nafn og heimilisfang máu ekki vera tóm.");
    return;
  }

  
  cart.name = name;
  cart.address = address;

  
  console.log(`Pöntun móttekin ${name}.`);
  console.log(`Vörur verða sendar á ${address}.\n`);
  console.log(cartInfo(cart));
}
