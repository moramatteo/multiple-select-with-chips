# MULTIPLE SELECT WITH CHIPS

# Table of contents
- [Prerequisites](#Prerequisites)
- [Installation](#Installation)
- [Usage](#Usage)
- [Configuration](#Configuration)

## Prerequisites
- Per far funzionare correttamente il plugin c'è bisogno di [Jquery](https://jquery.com/download/)

## Installation
- With cdnjs
  ```
  https://cdn.jsdelivr.net/npm/multiple_select_with_chips@1.0.0/multiple_select_with_chips.min.js
  ```
  ```
  https://cdn.jsdelivr.net/npm/multiple_select_with_chips@1.0.0/multiple_select_with_chips.min.css
  ```

- With npm
  ```
  npm install multiple_select_with_chips
  ```

## Usage
Implementa prima i files necessari descritti nel [Prerequisites](#Prerequisites) paragrafo
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <script src="jquery-3.5.1.js"></script>
    <script src="mousetrap.min.js"></script>
    <script src="mousetrap-pause.js"></script>
    <link rel="stylesheet" href="multiple_select_with_chips.css">
  </head>
  <body>
    <!-- html content -->
    <script src="multiple_select_with_chips.js"></script>
  </body>
```
Il plugin cerca un div con la classe "multiple-select-chip" e con un attributo "select_name" che puo avere come valore qualsiasi ma che deve essere univoco nel sito
```html
  <div class="multiple-select-chip" select_name="nome_univoco">
  </div>
```

Per impostare i valori creare un array di oggetti con le opzioni *text* e *value* che DEVONO essere presenti. In aggiunta puoi aggiungere `select: true` se vuoi che l'opzione sia già selezionata al caricamento del sito.

<u>N.B. Non sono ammessi opzioni con lo stesso valori</u>
```js
var values = [
    { text: "prova1", value: "val1" },
    { text: "prova2", value: "val2", select: true },
    { text: "prova3", value: "val3" }
  ];
```
Come chiamare la classe per far funzionare il plugins
```js
var select = new select(name_use_in_select_name_attribute, value)
```
Per personalizzare maggiormente puoi aggiungere un terzo attributo quando chiami la classe:
```js
var config {
 //di default è true
 add_personal_chip: false,
 //di default è Cerca
 placeholder: "same text",
 //di default è true
 autocomplete: false
 };
```


## Configuration

## Full example
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <script src="jquery-3.5.1.js"></script>
    <link rel="stylesheet" href="multiple_select_with_chips.css">
  </head>
  <body>
    <div class="multiple-select-chip" select_name="first_select">
  	</div>
    <script src="multiple_select_with_chips.js"></script>
	<script>
	  var values = [
        { text: "prova1", value: "val1" },
        { text: "prova2", value: "val2", select: true },
        { text: "prova3", value: "val3" }
      ];
	  var config {
		 add_personal_chip: false,
		 placeholder: "same text",
		 autocomplete: false
		 };
	 var select = new select("first_select", value, config)
	</script>
  </body>
```