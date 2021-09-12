# Table of contents

- [Prerequisites](#Prerequisites)
- [Installation](#Installation)
- [Usage](#Usage)
- [Options](#Options)
- [Methods](#Methods)
- [Con le funzioni al posto della classe](#Con-le-funzioni-al-posto-della-classe)
- [Full example](#Full-example)
- [License](#License)

# Prerequisites

- Per far funzionare correttamente il plugin c'è bisogno di [Jquery](https://jquery.com/download/)

# Installation

Using jsDelivr CDN

```
https://cdn.jsdelivr.net/npm/multiple_select_with_chips/dist/multiple_select_with_chips.min.js

https://cdn.jsdelivr.net/npm/multiple_select_with_chips/dist/multiple_select_with_chips.min.css
```

Using npm

```
npm install multiple_select_with_chips
```

# Usage

Implementa prima i files necessari descritti nel [Prerequisites](#Prerequisites) paragrafo

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <script src="jquery-3.5.1.js"></script>
    <link rel="stylesheet" href="multiple_select_with_chips.min.css" />
    <script src="multiple_select_with_chips.min.js"></script>
  </head>
  <body>
    <!-- html content -->
  </body>
</html>
```

Creare un div con la classe "multiple-select-chip" e con un attributo "select_name" con uno e uno solo valore qualsiasi ma che deve essere univoco

```html
<div class="multiple-select-chip" select_name="nome_univoco"></div>
```

Usare la classe per far funzionare il plugins

```js
var select = new select(select_name_attribute, values, config);
```

- **select_name_attribute**

  - Type: `stringa`
  - Valore dell'attributo `select_name` del div target

- **values**
  - Type: `array`
  - Contiene oggetti per impostare le opzioni

Per impostare i valori creare un array di oggetti con le opzioni _text_ e _value_ che DEVONO essere presenti. In aggiunta puoi aggiungere `select: true` se vuoi che l'opzione sia già selezionata al caricamento del sito.

<u>N.B. Non sono ammessi opzioni con lo stesso valori</u>

```js
var values = [
  { text: "prova1", value: "val1" },
  { text: "prova2", value: "val2", select: true },
  { text: "prova3", value: "val3" },
];
```

# Options

You may set viewer options with `new select(select_name_attribute, values, config)`

### **add_personal_chip**

- Type: `Boolean`
- Default: `true`

> Abilita/Disabilita la possibilità dell'utente di aggiungere una personale opzione

### **placeholder**

- Type: `stringa`
- Default: `Cerca`

> Modifica il valore della'tributo `placeholder` del tag input

### **autocomplete**

- Type: `Boolean`
- Default: `true`

> Abilita/Disabilita il filtro delle opzioni in base al testo inserito nel campo di imput

### **max_selections**

- Type: `Numero`

> Aggiunge un limite massimo di elementi selezionabili

### **onchange**

- Type: `Stringa`

> Nome di una eventuale funzione creata dallo sviluppatore da eseguire quando una opzione viene selezionata o deselezionata

I primi 3 parametri della funzione sono occuapti da dei valori di ritorno preimpostati:
  - Il primo indica il valore dell'atributo `select_name` del div in cui è avvenuto l'evento
  - Il secondo indica se è stata selezionata una nuova opzione (`"add"`) o se è stata deselezionata una opzione (`"remove"`)
  - Il terzo valore indica il valore dell'opzione selezionata/deselezionata


### **onkeyup**

- Type: `Stringa`

> Nome di una eventuale funzione creata dallo sviluppatore da eseguire quando l'utente digita qualcosa nel campo di input

I primi 2 parametri della funzione sono occuapti da dei valori di ritorno preimpostati:
  - Il primo indica il valore dell'atributo `select_name` del div in cui è avvenuto l'evento
  - Il secondo indica il valore del tag input

# Methods

### **new_datas(data, mod)**

- **data**:

  - Type: `array`
  - Array dei nuovi valori (sintassi uguale all'array descritto prima)

- **mod** (optional):
  - Type: `string`
  - Default: `replace`
  - Options:
    - `replace`: delete all other already existing options
    - `add`: adds new options to the end of existing ones

> Aggiunge nuove opzioni (per esempio dopo una chiamata ajax al server)

### **get_value()**

> Valore dell'attributo select_name del div target

### **check_all_selected()**

> Controlla se tutte le opzioni sono state selezionate

### **select_all()**

> seleziona tutte le opzioni

### **deselect_all(forced)**

- **forced** (optional)
  - Type: `string`
  - Se uguale a `forced` deseleziona anche le opzioni non esistenti aggiunte dall'utente
    > Deseleziona tutte le opzioni (di default tranne le opzioni non esistenti aggiunte dall'utente)

# Con le funzioni al posto della classe

Il plugins può essere usato anche senza le classi ma solo con le funzioni con piccolissime differenze:

- All'inizio, al posto di usare la classe, usare la funzione chiamata:

```js
select_constructor (select_name_attribute, values, config)`
```

- Al posto dei metodi si posso usare delle funzioni con lo stesso nome e stessi argomenti **ma aggiungedo PER PRIMO DAVAVANTI A TUTTI GLI ALTRI il valore dell'attributo `select_name` del div a cui ci si riferisce**

# Full example

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <script src="jquery-3.5.1.js"></script>
    <link rel="stylesheet" href="multiple_select_with_chips.min.css" />
    <script src="multiple_select_with_chips.min.js"></script>
  </head>
  <body>
    <div class="multiple-select-chip" select_name="first_select"></div>
  </body>
</html>
```

```html
<script>
  var values = [
      { text: "prova1", value: "val1" },
      { text: "prova2", value: "val2", select: true },
      { text: "prova3", value: "val3" }
    ];

  var config {
    add_personal_chip: false,
    placeholder: "same text",
    autocomplete: false,
    max_selections: 2,
    onchange: "change",
    onkeyup: "type",
    };

  // Con la classe
  var select = new select("first_select", value, config)

  // Con la funzione:
  select_constructor("first_select", value, config)

  //esempi di funzione personalizzate
  function change(select_name_arg, mod, value) {
    console.log("change: " + select_name_arg + " = " + mod + " con valore " + value)
  }
  function type(select_name_arg, text) {
    console.log("type: " + select_name_arg + " = " + text)
  }
</script>
```

# License
[MIT](https://opensource.org/licenses/MIT) ©

[⬆ back to top](#table-of-contents)